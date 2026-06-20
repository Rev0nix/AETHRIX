const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;

  const alreadyReviewed = await Review.findOne({ product: req.params.productId, user: req.user._id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const verifiedPurchase = await Order.exists({
    user: req.user._id,
    'items.product': req.params.productId,
    isPaid: true,
  });

  const review = await Review.create({
    product: req.params.productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    title,
    comment,
    verifiedPurchase: !!verifiedPurchase,
  });

  res.status(201).json({ success: true, data: review });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }
  const productId = review.product;
  await review.deleteOne();
  await Review.recalculateProductRating(productId);
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, createReview, deleteReview };
