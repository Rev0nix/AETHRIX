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

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const paidOrderQuery = {
  $or: [
    { paymentStatus: 'paid' },
    { paymentStatus: { $exists: false }, isPaid: true },
  ],
};

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

  const itemsPrice = items.reduce((sum, item) => {
    const price = Number(item.price);
    const qty = Number(item.qty);

    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(qty) || qty < 1) {
      res.status(400);
      throw new Error('Order items must include a valid price and quantity');
    }

    return sum + price * qty;
  }, 0);
  const shippingPrice = itemsPrice >= 999 ? 0 : 99;

  let discountAmount = 0;
  let coupon;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid(itemsPrice);
      if (validity.valid) {
        discountAmount = coupon.calculateDiscount(itemsPrice);
      } else {
        coupon = null;
      }
    }
  }

  const totalPrice = itemsPrice + shippingPrice - discountAmount;
  const reservedItems = [];
  let couponApplied = false;
  let order;

  try {
    // Reserve stock first with a conditional update. If any later step fails,
    // the catch block restores every reservation so no partial order remains.
    for (const item of items) {
      const qty = Number(item.qty);
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!product) {
        const exists = await Product.exists({ _id: item.product });
        res.status(exists ? 400 : 404);
        throw new Error(
          exists ? `${item.name || 'This product'} is out of stock.` : `Product not found: ${item.name || item.product}`
        );
      }

      reservedItems.push({ product: item.product, qty });
    }

    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
      couponApplied = true;
    }

    order = await Order.create({
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
      couponCode: coupon?.code,
      itemsPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      isPaid,
      paymentStatus: isPaid ? 'paid' : 'pending',
      paidAt: isPaid ? new Date() : undefined,
      status: 'confirmed',
    });
  } catch (error) {
    if (order) await order.deleteOne();
    if (couponApplied) await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: -1 } });
    await Promise.all(
      reservedItems.map(({ product, qty }) => Product.findByIdAndUpdate(product, { $inc: { stock: qty } }))
    );
    throw error;
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

  const search = typeof req.query.search === 'string'
    ? escapeRegex(req.query.search.trim().slice(0, 100))
    : '';
  if (search) {
    query.$or = [
      {
        orderNumber: {
          $regex: search,
          $options: "i",
        },
      },
      {
        "shippingAddress.fullName": {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

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
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status, trackingNumber, courier } = req.body;
  const previousStatus = order.status;

  if (status && previousStatus === 'cancelled' && status !== 'cancelled') {
    res.status(400);
    throw new Error('Cancelled orders cannot be reopened');
  }

  if (status === 'cancelled' && previousStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.qty,
          },
        }
      );
    }

    // No Razorpay refund is issued by this endpoint. Keep the payment state
    // accurate until the refund is handled through the payment provider.
    if (order.paymentStatus === 'paid' || order.isPaid) {
      order.paymentStatus = 'refund_pending';
    }
  }
  if (status) order.status = status;
  if (typeof trackingNumber === 'string') order.trackingNumber = trackingNumber.trim();
  if (typeof courier === 'string') order.courier = courier.trim();

  const stepMap = {
    confirmed: 0,
    packed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4,
  };

  if (stepMap[status] !== undefined) {
    for (let i = 0; i <= stepMap[status]; i++) {
      if (order.trackingSteps[i]) {
        order.trackingSteps[i].completed = true;
        order.trackingSteps[i].completedAt = order.trackingSteps[i].completedAt || new Date();
      }
    }
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  const updated = await order.save();
  await sendEmail({
    to: updated.user.email,
    subject: `Order ${updated.orderNumber} Updated`,
    html: `
    <h2>Your order status has changed.</h2>

    <p>
      New Status:
      <strong>${updated.status}</strong>
    </p>
  `,
  });
  res.json({ success: true, data: updated });
});

// @desc    Get revenue / dashboard analytics (admin)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: paidOrderQuery },
    { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
  ]);
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await Order.distinct('user').then((arr) => arr.length);
  const avgOrderValue = totalRevenue[0]?.count > 0
    ? totalRevenue[0].total / totalRevenue[0].count
    : 0;

  // Last 7 days revenue trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const revenueTrend = await Order.aggregate([
    { $match: { ...paidOrderQuery, createdAt: { $gte: sevenDaysAgo } } },
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
