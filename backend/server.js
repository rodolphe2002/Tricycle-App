// server.js
const express = require('express');
const mongoose = require('mongoose'); // <-- une seule déclaration ici
require('dotenv').config();
const path = require('path');

// Routes
const clientRoutes = require('./routes/clientRoute');
const conducteurRoutes = require('./routes/conducteurRoute');
const commandeRoutes = require('./routes/commandeRoute');

// socket.io
const http = require("http");
const socketIO = require("socket.io");

// Initialiser l'app Express
const app = express();

// Middleware pour parser le body des requêtes
app.use(express.json());
const cors = require("cors");
app.use(cors());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_UR) // <-- MONGO_UR ou MONGO_URL ? Vérifie la variable d'environnement !
  .then(() => console.log("Connexion à MongoDB Atlas réussie"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));

// Servir les fichiers frontend depuis le dossier public
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/clients', clientRoutes);
app.use('/api/conducteurs', conducteurRoutes);
app.use('/api', commandeRoutes);
app.use('/api/commandes', commandeRoutes);

// configuration socket.io
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

app.set("io", io); // pour y accéder dans les routes

io.on("connection", (socket) => {
  console.log("Un client est connecté :", socket.id);

  socket.on("join", (phone) => {
    socket.join(phone); // Chaque client rejoint un "room" basé sur son numéro
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
