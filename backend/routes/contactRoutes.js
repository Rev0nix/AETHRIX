const express = require('express');

const {
    createMessage,
    getMessages
} = require('../controllers/contactController');

const router = express.Router();

const {
    createMessage,
    getMessages,
    deleteMessage
} = require('../controllers/contactController');

router.route('/')
    .post(createMessage)
    .get(getMessages);

router.route('/:id')
    .delete(deleteMessage);

module.exports = router;