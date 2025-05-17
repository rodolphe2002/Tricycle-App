// models/conducteur.js
const mongoose = require('mongoose');

const conducteurSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tricycleNumber: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Conducteur', conducteurSchema);
