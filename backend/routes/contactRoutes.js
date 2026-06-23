const express = require('express');

const {
  createMessage,
  getMessages
} = require('../controllers/contactController');

const router = express.Router();

router.route('/')
.post(createMessage)
.get(getMessages);

module.exports = router;