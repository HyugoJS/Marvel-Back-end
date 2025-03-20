require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 100;
    const skip = (pageNumber - 1) * limit;
    let filters = "";

    if (req.query.name) {
      filters += `&name=${req.query.name}`;
    }

    const response = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&limit=${limit}&skip=${skip}${filters}`
    );
    const data = response.data;
    // console.log("ici=>", data);

    const characters = data.results.map((char) => ({
      id: char._id,
      name: char.name,
      image: char.thumbnail.path + "." + char.thumbnail.extension,
      description: char.description,
    }));

    res.json({
      count: data.count, // Nombre total de personnages
      totalPages: Math.ceil(data.count / limit), // Nombre total de pages
      currentPage: pageNumber,
      characters,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/characters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=LEcD4FLFQ7ZlsXaB`
    );

    const char = response.data;
    // console.log(char);

    const formattedCharacter = {
      id: char._id,
      name: char.name,
      image: char.thumbnail.path + "." + char.thumbnail.extension,
      description: char.description,
      comics: char.comics,
    };

    res.json(formattedCharacter);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du personnage",
      error: error.message,
    });
  }
});

module.exports = router;
