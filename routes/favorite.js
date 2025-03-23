const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../Models/User");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/favorite/character/:id", isAuthenticated, async (req, res) => {
  try {
    const characterId = req.params.id;
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    // console.log(user);
    // Vérifie si l'utilisateur est connecté
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Vérifie si le personnage est deja en favori
    const alreadyFavorite = user.favorites.some(
      (fav) => fav.id === characterId
    );

    if (alreadyFavorite) {
      return res.status(400).json({ message: "Personnage déjà en favori" });
    }
    const response = await axios.get(
      `https://site--marvel-back--fc7nwyvb2r4r.code.run/characters/${characterId}`
    );

    if (!response.data) {
      return res.status(404).json({ message: "Personnage introuvable" });
    }
    console.log(response.data);

    // Ajouter aux favoris dans la clé favorites des users
    user.favorites.push({
      id: characterId,
      name: response.data.name,
      image: response.data.image,
      description: response.data.description,
    });
    console.log(user.favorites);

    await user.save();

    return res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/favorite/comics/:id", isAuthenticated, async (req, res) => {
  try {
    const comicId = req.params.id;
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    console.log(token);

    // console.log(user);
    // Vérifie si l'utilisateur est connecté
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Vérifie si le comic est deja en favori
    const alreadyFavorite = user.favorites.some((fav) => fav.id === comicId);

    if (alreadyFavorite) {
      return res.status(400).json({ message: "Comic déjà en favori" });
    }
    const response = await axios.get(
      `https://site--marvel-back--fc7nwyvb2r4r.code.run/comics/${comicId}`
    );
    console.log(response.data);

    if (!response.data) {
      return res.status(404).json({ message: "Personnage introuvable" });
    }

    // Ajouter aux favoris dans la clé favorites des users
    user.favorites.push({
      id: comicId,
      title: response.data.title,
      image: response.data.image,
      description: response.data.description,
    });
    console.log(user.favorites);

    await user.save();

    return res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/favorite/character/:id", isAuthenticated, async (req, res) => {
  try {
    const characterId = req.params.id;
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Filtrer pour retirer le favori
    user.favorites = user.favorites.filter((fav) => fav.id !== characterId);

    await user.save();

    res.json({
      message: "Personnage retiré des favoris",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/favorite/comics/:id", isAuthenticated, async (req, res) => {
  try {
    const comicId = req.params.id;
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Filtrer pour retirer le favori
    user.favorites = user.favorites.filter((fav) => fav.id !== comicId);

    await user.save();

    res.json({
      message: "Personnage retiré des favoris",
    });
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

    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
