const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Endpoint: POST /api/contacts -> Submit a new contact message
router.post('/', contactController.submitContact);

module.exports = router;
