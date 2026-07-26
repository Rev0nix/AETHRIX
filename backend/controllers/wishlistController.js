const Wishlist = require("../models/Wishlist");

// Get logged-in user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("items.product");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items: [],
      });
    }

    const exists = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};