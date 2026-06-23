const axios = require('axios');
const Product = require('../models/Product');

const importAmazonProduct = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Amazon URL is required',
      });
    }

    // Extract ASIN
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i);

    if (!asinMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Amazon URL',
      });
    }

    const asin = asinMatch[1];

    // Check if product already exists
    const existing = await Product.findOne({
      affiliateLink: url,
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Product already exists',
        data: existing,
      });
    }

    // Fetch from Rainforest API
    const response = await axios.get(
      'https://api.rainforestapi.com/request',
      {
        params: {
          api_key: process.env.RAINFOREST_API_KEY,
          type: 'product',
          amazon_domain: 'amazon.in',
          asin,
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 2));

    const p = response.data.product || response.data.product_results;

    if (!p) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = await Product.create({
      name: p.title,
      description: p.description || p.title,
      shortDescription:
        p.feature_bullets?.join(' ') || p.description || '',

      brand: p.brand || 'AETHRIX',

      category: 'electronics',

      price:
        p.buybox_winner?.price?.value ||
        p.buybox_winner?.price?.raw ||
        0,

      compareAtPrice:
        p.list_price?.value ||
        p.buybox_winner?.price?.value ||
        0,

      images: [
        {
          url: p.main_image?.link || '',
          alt: p.title,
        },
      ],

      affiliateLink: url,

      stock: 100,

      rating: p.rating || 0,

      numReviews:
        p.ratings_total ||
        p.ratings_count ||
        0,

      tags:
        p.categories?.map((c) => c.name) || [],

      badge: 'NEW',

      isFeatured: false,

      isFlashSale: false,

      isActive: true,
    });

    res.json({
      success: true,
      message: 'Product imported successfully',
      data: product,
    });

  } catch (err) {
    console.error(err.response?.data || err);

    res.status(500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

module.exports = {
  importAmazonProduct,
};