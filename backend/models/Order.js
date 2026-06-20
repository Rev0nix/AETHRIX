const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: String },
    color: { type: String },
  },
  { _id: false }
);

const trackingStepSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
    paymentResult: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: String,
    },
    couponCode: { type: String },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: { type: String },
    trackingSteps: {
      type: [trackingStepSchema],
      default: () => [
        { label: 'Order Confirmed', completed: true, completedAt: new Date() },
        { label: 'Packed', completed: false },
        { label: 'Shipped', completed: false },
        { label: 'Out for Delivery', completed: false },
        { label: 'Delivered', completed: false },
      ],
    },
    deliveredAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'AX-' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
