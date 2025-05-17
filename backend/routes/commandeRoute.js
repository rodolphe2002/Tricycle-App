const express = require("express");
const Commande = require("../models/Commande");
const Client = require("../models/Client");
const Conducteur = require("../models/Conducteur");
const router = express.Router();

// POST /api/commander
router.post("/commander", async (req, res) => {
  const { numero_telephone_client, depart, destination } = req.body;

  try {
    // Vérifier si le client existe
    const client = await Client.findOne({ phone: numero_telephone_client });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé." });
    }

    // Rechercher un conducteur NON encore affecté à une commande "acceptée" ou "en cours"
    const commandesEnCours = await Commande.find({ statut: { $in: ["en cours", "acceptée"] } });
    const conducteursOccupes = commandesEnCours.map(cmd => cmd.conducteur?.toString());

    // Trouver un conducteur disponible
    const conducteurDispo = await Conducteur.findOne({
      _id: { $nin: conducteursOccupes }
    });

    // Créer la commande
   const nouvelleCommande = new Commande({
  numero_telephone_client,
  depart,
  destination,
  conducteur: conducteurDispo ? conducteurDispo._id : null,
  ...(conducteurDispo && { statut: "en cours" }) // statut est défini uniquement si un conducteur est dispo
});


    await nouvelleCommande.save();

    res.status(201).json({
      message: conducteurDispo
        ? "Commande envoyée et conducteur affecté avec succès."
        : "Commande envoyée. En attente d’un conducteur disponible.",
      commande: nouvelleCommande
    });

  } catch (error) {
    console.error("Erreur lors de la commande :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// GET /api/commandes/en-attente
router.get("/en-attente", async (req, res) => {
    console.log("Route /commandes/en-attente appelée");
  try {
    const commandes = await Commande.find({ statut: "en attente" });
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// PUT /api/commandes/:id/statut
router.put("/commandes/:id/statut", async (req, res) => {
  const { id } = req.params;
  const { statut, conducteurId } = req.body;

  if (!["acceptée", "refusée"].includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    const commande = await Commande.findById(id);
    if (!commande) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    commande.statut = statut;

    if (statut === "acceptée") {
      commande.conducteur = conducteurId;
    }

    await commande.save();

    // Notifier le client via Socket.IO
    const io = req.app.get("io");
    if (statut === "acceptée" && io) {
      io.to(commande.numero_telephone_client).emit("notification", {
        message: "Votre commande a été acceptée par un conducteur.",
        commandeId: commande._id
      });
    }

    res.status(200).json({ message: "Statut mis à jour", commande });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


module.exports = router;
