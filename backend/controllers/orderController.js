const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order (pre-checkout)
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in INR
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  const options = {
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  res.json({ success: true, data: order, key: process.env.RAZORPAY_KEY_ID });
});

// @desc    Create order (after payment / COD)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    couponCode,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  // Verify Razorpay signature if online payment
  let isPaid = false;
  if (paymentMethod === 'razorpay') {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      res.status(400);
      throw new Error('Payment verification failed');
    }
    isPaid = true;
  }

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= 999 ? 0 : 99;

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid(itemsPrice);
      if (validity.valid) {
        discountAmount = coupon.calculateDiscount(itemsPrice);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    paymentResult: paymentMethod === 'razorpay' ? {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
    } : undefined,
    couponCode,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalPrice,
    isPaid,
    paidAt: isPaid ? new Date() : undefined,
    status: 'confirmed',
  });

  // Decrement stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }

  // Fire-and-forget confirmation email
  sendEmail({
    to: req.user.email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `<h2>Thanks for your order, ${req.user.name}!</h2><p>Your order <strong>${order.orderNumber}</strong> has been confirmed. Total: ₹${order.totalPrice}</p>`,
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, data: order });
});

// @desc    Track order by order number (public-ish, requires order number)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).select(
    'orderNumber status trackingSteps trackingNumber createdAt items totalPrice'
  );
  if (!order) {
    res.status(404);
    throw new Error('No order found with that tracking number');
  }
  res.json({ success: true, data: order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const count = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ success: true, data: orders, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status, trackingNumber } = req.body;
  order.status = status || order.status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  const stepMap = {
    confirmed: 0,
    packed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  if (stepMap[status] !== undefined) {
    for (let i = 0; i <= stepMap[status]; i++) {
      order.trackingSteps[i].completed = true;
      order.trackingSteps[i].completedAt = order.trackingSteps[i].completedAt || new Date();
    }
  }

  if (status === 'delivered') order.deliveredAt = new Date();

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc    Get revenue / dashboard analytics (admin)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await Order.distinct('user').then((arr) => arr.length);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0;

  // Last 7 days revenue trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const revenueTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      avgOrderValue: Math.round(avgOrderValue),
      revenueTrend,
    },
  });
});

module.exports = {
  createRazorpayOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
