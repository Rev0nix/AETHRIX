const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema(
  {
    size: { type: String },
    color: { type: String },
    sku: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    priceOverride: { type: Number },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String },
    brand: { type: String, default: 'AETHRIX' },
    category: {
      type: String,
      required: true,
      enum: ['electronics', 'fashion', 'smart-gadgets', 'home-decor', 'fitness', 'accessories'],
    },
    subCategory: { type: String },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    images: [{ url: String, publicId: String, alt: String }],
    variants: [variantSchema],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],
    badge: { type: String, enum: ['NEW', 'SALE', 'BESTSELLER', 'LIMITED', 'TRENDING', ''], default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSaleEndsAt: { type: Date },
    isActive: { type: Boolean, default: true },
    weight: { type: Number },
    dimensions: { length: Number, width: Number, height: Number },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

productSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
  }
  next();
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
