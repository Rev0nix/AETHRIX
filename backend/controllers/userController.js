const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  const index = user.wishlist.findIndex((id) => id.toString() === req.params.productId);

  let added;
  if (index >= 0) {
    user.wishlist.splice(index, 1);
    added = false;
  } else {
    user.wishlist.push(req.params.productId);
    added = true;
  }

  await user.save();
  res.json({ success: true, added, data: user.wishlist });
});

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const count = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ success: true, data: users, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get user by id (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, data: user });
});

// @desc    Update user role / active status (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;

  const updated = await user.save();
  res.json({ success: true, data: { _id: updated._id, name: updated.name, role: updated.role, isActive: updated.isActive } });
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

module.exports = { toggleWishlist, getWishlist, getUsers, getUserById, updateUser, deleteUser };
