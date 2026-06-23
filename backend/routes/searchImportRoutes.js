const express = require('express');
const { searchAmazonProducts } = require('../controllers/searchImportController');

const router = express.Router();

router.get('/amazon', searchAmazonProducts);

module.exports = router;