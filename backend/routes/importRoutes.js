const express = require('express');
const { importAmazonProduct } = require('../controllers/importController');

const router = express.Router();

router.post('/amazon', importAmazonProduct);

module.exports = router;