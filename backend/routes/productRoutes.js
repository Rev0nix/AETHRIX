const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getFlashSaleProducts,
  getSearchSuggestions,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/search-suggestions', getSearchSuggestions);

router.route('/').get(getProducts).post(protect, admin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.get('/:id/related', getRelatedProducts);
router.post('/:id/images', protect, admin, upload.array('images', 6), uploadProductImages);

router.route('/:productId/reviews').get(getProductReviews).post(protect, createReview);

module.exports = router;
