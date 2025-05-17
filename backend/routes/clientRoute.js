// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Inscription du client
router.post('/', async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    const newClient = new Client({ name, phone, password });
    await newClient.save();
    res.status(201).json(newClient); // ← On renvoie le client complet avec l’_id
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription du client', error });
  }
});

module.exports = router;
