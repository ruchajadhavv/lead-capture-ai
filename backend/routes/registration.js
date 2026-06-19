const express = require('express');
const router = express.Router();
const RegistrationModel = require('../models/Registration');

// @route   POST /api/register
// @desc    Create a new lead registration
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, businessName, message } = req.body;

    // registration schema requires message; keep it compatible with UI/clients
    if (!firstName || !lastName || !email || !businessName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newRegistration = new RegistrationModel({
      firstName,
      lastName,
      email,
      businessName,
      message: message || '',
    });

    const saved = await newRegistration.save();
    res.status(201).json({ success: true, message: 'Registration saved!', registration: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

