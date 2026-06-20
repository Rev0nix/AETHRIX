const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/validate', protect, validateCoupon);

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/:id').put(protect, admin, updateCoupon).delete(protect, admin, deleteCoupon);

module.exports = router;
