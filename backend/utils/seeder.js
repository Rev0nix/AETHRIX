// Run with: npm run seed   (or: npm run seed:destroy to wipe data)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const users = [
  { name: 'Admin User', email: 'admin@aethrix.in', password: 'admin12345', role: 'admin' },
  { name: 'Demo Customer', email: 'customer@aethrix.in', password: 'customer123', role: 'customer' },
];

const products = [
  // Electronics
  { name: 'Pulse Wireless Earbuds Pro', description: 'Active noise cancellation, 30hr battery life, premium sound stage.', shortDescription: 'ANC wireless earbuds', category: 'electronics', price: 3499, compareAtPrice: 4999, stock: 120, badge: 'BESTSELLER', tags: ['audio', 'wireless', 'earbuds'], isFeatured: true },
  { name: 'Orbit 4K Action Camera', description: 'Waterproof 4K action camera with image stabilization and wide FOV lens.', shortDescription: '4K waterproof action cam', category: 'electronics', price: 8999, compareAtPrice: 11999, stock: 45, badge: 'NEW', tags: ['camera', '4k'], isFeatured: true },
  { name: 'Volt Fast Charger 65W', description: 'GaN tech fast charger, charges laptop and phone simultaneously.', shortDescription: '65W GaN charger', category: 'electronics', price: 1799, compareAtPrice: 2499, stock: 200, badge: 'SALE', tags: ['charger', 'gan'] },
  // Fashion
  { name: 'Drift Oversized Tee', description: '240 GSM heavyweight cotton oversized tee with dropped shoulders.', shortDescription: 'Oversized cotton tee', category: 'fashion', price: 1199, compareAtPrice: 1799, stock: 300, badge: 'BESTSELLER', tags: ['tee', 'streetwear'], isFeatured: true },
  { name: 'Northbound Puffer Jacket', description: 'Lightweight insulated puffer jacket, water-resistant shell.', shortDescription: 'Insulated puffer jacket', category: 'fashion', price: 4499, compareAtPrice: 5999, stock: 60, badge: 'NEW', tags: ['jacket', 'winter'], isFeatured: true },
  { name: 'Core Relaxed Denim', description: 'Relaxed fit denim jeans, stonewashed finish, durable stitching.', shortDescription: 'Relaxed fit denim', category: 'fashion', price: 2299, stock: 150, tags: ['denim', 'jeans'] },
  // Smart Gadgets
  { name: 'Nova Smartwatch X2', description: 'AMOLED display, heart rate monitor, 7-day battery, 100+ sport modes.', shortDescription: 'AMOLED smartwatch', category: 'smart-gadgets', price: 5999, compareAtPrice: 7999, stock: 80, badge: 'TRENDING', tags: ['smartwatch', 'wearable'], isFeatured: true },
  { name: 'Beacon Smart Home Hub', description: 'Voice-controlled smart home hub, compatible with 1000+ devices.', shortDescription: 'Smart home hub', category: 'smart-gadgets', price: 4299, stock: 50, badge: 'NEW', tags: ['smart-home', 'hub'] },
  { name: 'Loop Smart Ring', description: 'Track sleep, activity, and recovery with a sleek titanium smart ring.', shortDescription: 'Titanium smart ring', category: 'smart-gadgets', price: 12999, compareAtPrice: 15999, stock: 30, badge: 'LIMITED', tags: ['ring', 'health'], isFeatured: true },
  // Home Decor
  { name: 'Aura Ceramic Vase Set', description: 'Hand-finished ceramic vase set of 3, minimalist Scandinavian design.', shortDescription: 'Ceramic vase set of 3', category: 'home-decor', price: 1899, stock: 90, tags: ['decor', 'ceramic'] },
  { name: 'Lumen Ambient Floor Lamp', description: 'Dimmable LED floor lamp with warm and cool light modes.', shortDescription: 'Dimmable LED floor lamp', category: 'home-decor', price: 3299, compareAtPrice: 4299, stock: 40, badge: 'SALE', tags: ['lighting', 'lamp'], isFeatured: true },
  { name: 'Weave Cotton Throw Blanket', description: 'Soft cotton-blend throw blanket, machine washable, 130x180cm.', shortDescription: 'Cotton throw blanket', category: 'home-decor', price: 1499, stock: 110, tags: ['blanket', 'textile'] },
  // Fitness
  { name: 'Forge Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells, 5-25kg per hand, quick-lock dial.', shortDescription: 'Adjustable dumbbell set', category: 'fitness', price: 8999, compareAtPrice: 10999, stock: 35, badge: 'BESTSELLER', tags: ['dumbbell', 'home-gym'], isFeatured: true },
  { name: 'Flow Premium Yoga Mat', description: 'Extra thick non-slip yoga mat with alignment lines, eco TPE material.', shortDescription: 'Non-slip yoga mat', category: 'fitness', price: 1299, stock: 200, badge: 'NEW', tags: ['yoga', 'mat'] },
  { name: 'Surge Resistance Band Kit', description: '5-piece resistance band set with door anchor and carry bag.', shortDescription: 'Resistance band set', category: 'fitness', price: 899, stock: 250, tags: ['bands', 'home-gym'] },
  // Accessories
  { name: 'Horizon Leather Wallet', description: 'Full-grain leather bifold wallet with RFID-blocking lining.', shortDescription: 'RFID leather wallet', category: 'accessories', price: 1599, compareAtPrice: 2199, stock: 140, badge: 'BESTSELLER', tags: ['wallet', 'leather'], isFeatured: true },
  { name: 'Anchor Steel Watch', description: 'Minimalist stainless steel watch, sapphire crystal, 5ATM water resistance.', shortDescription: 'Stainless steel watch', category: 'accessories', price: 4999, compareAtPrice: 6499, stock: 70, badge: 'TRENDING', tags: ['watch', 'steel'], isFeatured: true },
  { name: 'Canvas Weekender Duffel', description: 'Durable canvas duffel bag with leather trims, fits airline carry-on.', shortDescription: 'Canvas duffel bag', category: 'accessories', price: 2799, stock: 85, badge: 'NEW', tags: ['bag', 'travel'] },
];

const coupons = [
  { code: 'AETHRIX10', type: 'percent', value: 10, minOrderValue: 999, usageLimit: 1000 },
  { code: 'WELCOME20', type: 'percent', value: 20, minOrderValue: 1499, maxDiscount: 1000, usageLimit: 500 },
  { code: 'FLAT500', type: 'flat', value: 500, minOrderValue: 2999, usageLimit: 300 },
];

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    await User.create(users);
    await Product.insertMany(products);
    await Coupon.insertMany(coupons);

    console.log('✅ Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    console.log('🗑️  Data destroyed');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
