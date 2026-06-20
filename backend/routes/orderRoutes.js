const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/track/:orderNumber', trackOrder);

router.post('/razorpay', protect, createRazorpayOrder);
router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/stats/dashboard', protect, admin, getDashboardStats);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
