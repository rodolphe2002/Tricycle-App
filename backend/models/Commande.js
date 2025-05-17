const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  numero_telephone_client: { type: String, required: true },
  depart: { type: String, required: true },
  destination: { type: String, required: true },
  statut: { type: String, default: "en attente" },
  conducteur: { type: mongoose.Schema.Types.ObjectId, ref: "Conducteur" },
  date_commande: { type: Date, default: Date.now },
});

const Commande = mongoose.model("Commande", commandeSchema);

module.exports = Commande;
