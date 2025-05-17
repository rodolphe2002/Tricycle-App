// routes/conducteurRoutes.js
const express = require('express');
const router = express.Router();
const Conducteur = require('../models/Conducteur');

// Inscription du conducteur
router.post('/', async (req, res) => {
  const { name, phone, password, tricycleNumber } = req.body;

    console.log("Données reçues pour inscription :", req.body); // ← ici

  try {
    const newConducteur = new Conducteur({ name, phone, password, tricycleNumber });
    await newConducteur.save();
    res.status(201).json(newConducteur); // ← important !
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription du conducteur', error });
  }
});

module.exports = router;
