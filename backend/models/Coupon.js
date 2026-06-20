const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'flat'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (orderValue) {
  if (!this.isActive) return { valid: false, reason: 'Coupon is inactive' };
  if (this.expiresAt && this.expiresAt < new Date()) return { valid: false, reason: 'Coupon has expired' };
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit)
    return { valid: false, reason: 'Coupon usage limit reached' };
  if (orderValue < this.minOrderValue)
    return { valid: false, reason: `Minimum order value is ₹${this.minOrderValue}` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderValue) {
  let discount = this.type === 'percent' ? (orderValue * this.value) / 100 : this.value;
  if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount);
  return Math.round(Math.min(discount, orderValue));
};

module.exports = mongoose.model('Coupon', couponSchema);
