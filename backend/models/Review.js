const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: false },
    images: [{ type: String }],
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.recalculateProductRating = async function (productId) {
  const Product = mongoose.model('Product');
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.recalculateProductRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
