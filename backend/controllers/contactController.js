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

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await message.deleteOne();

  res.json({
    success: true,
    message: 'Deleted'
  });
});

module.exports = {
  createMessage,
  getMessages,
  deleteMessage
};