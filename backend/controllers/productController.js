const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products (filters, search, sort, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const query = { isActive: true };

  if (req.query.keyword) {
    query.$text = { $search: req.query.keyword };
  }
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.badge) {
    query.badge = req.query.badge;
  }
  if (req.query.minRating) {
    query.rating = { $gte: Number(req.query.minRating) };
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'price-asc') sort = { price: 1 };
  if (req.query.sort === 'price-desc') sort = { price: -1 };
  if (req.query.sort === 'rating') sort = { rating: -1 };
  if (req.query.sort === 'name') sort = { name: 1 };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product by slug or id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { slug: req.params.id }],
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json({ success: true, data: products });
});

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFlashSale: true,
    isActive: true,
    flashSaleEndsAt: { $gt: new Date() },
  }).limit(12);
  res.json({ success: true, data: products });
});

// @desc    Search suggestions (instant search)
// @route   GET /api/products/search-suggestions?q=
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const q = req.query.q;
  if (!q || q.length < 2) return res.json({ success: true, data: [] });

  const products = await Product.find({
    isActive: true,
    $or: [{ name: { $regex: q, $options: 'i' } }, { tags: { $regex: q, $options: 'i' } }],
  })
    .select('name slug price images category')
    .limit(8);

  res.json({ success: true, data: products });
});

// @desc    Get related products (same category)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);
  res.json({ success: true, data: related });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Clean up Cloudinary images
  for (const img of product.images || []) {
    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (e) {
        console.error('Cloudinary delete failed:', e.message);
      }
    }
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
const uploadProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images provided');
  }

  const uploadedImages = [];
  for (const file of req.files) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataUri = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataUri, { folder: 'aethrix/products' });
    uploadedImages.push({ url: result.secure_url, publicId: result.public_id, alt: product.name });
  }

  product.images.push(...uploadedImages);
  await product.save();

  res.status(201).json({ success: true, data: product.images });
});

module.exports = {
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
};
