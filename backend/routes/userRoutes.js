const express = require('express');
const router = express.Router();
const {
  toggleWishlist,
  getWishlist,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);

router.get('/', protect, admin, getUsers);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

module.exports = router;
