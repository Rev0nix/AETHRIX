const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

const createMessage = asyncHandler(async (req, res) => {
  const message = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    data: message
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort('-createdAt');

  res.json({
    success: true,
    data: messages
  });
});

module.exports = {
  createMessage,
  getMessages
};