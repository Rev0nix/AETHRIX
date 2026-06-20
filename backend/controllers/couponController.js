const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate / apply a coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  const validity = coupon.isValid(orderValue);
  if (!validity.valid) {
    res.status(400);
    throw new Error(validity.reason);
  }

  const discount = coupon.calculateDiscount(orderValue);
  res.json({ success: true, data: { code: coupon.code, discount, type: coupon.type, value: coupon.value } });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  Object.assign(coupon, req.body);
  const updated = await coupon.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
