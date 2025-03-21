const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../Models/User");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/favorite/:id", isAuthenticated, async (req, res) => {
  try {
    const characterId = req.params.id;
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Vérifie si le personnage est déjà en favori
    const isAlreadyFavorite = user.favorites.includes(characterId);

    if (isAlreadyFavorite) {
      // Supprimer des favoris
      user.favorites = user.favorites.filter((fav) => fav !== characterId);
    } else {
      // Ajouter aux favoris
      user.favorites.push(characterId);
    }

    // Sauvegarder en BDD
    await user.save();

    return res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    return res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
