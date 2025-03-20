require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  const pageNumber = Number(req.query.page) || 1;
  const limit = 100;
  const skip = (pageNumber - 1) * limit;
  let filters = "";

  if (req.query.title) {
    filters += `&title=${req.query.title}`;
  }
  try {
    const response = await axios(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&limit=${limit}&skip=${skip}${filters}`
    );
    const data = response.data;
    // console.log("ici=>", data);

    const comics = data.results.map((comic) => ({
      id: comic._id,
      title: comic.title,
      image: comic.thumbnail.path + "." + comic.thumbnail.extension,
      description: comic.description,
    }));

    res.json({
      count: data.count, // Nombre total de personnages
      totalPages: Math.ceil(data.count / limit), // Nombre total de pages
      currentPage: pageNumber,
      comics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${id}?apiKey=LEcD4FLFQ7ZlsXaB`
    );

    const comic = response.data;

    const formattedComic = {
      id: comic.id,
      title: comic.title,
      image: comic.thumbnail.path + "." + comic.thumbnail.extension,
      description: comic.description,
    };

    res.json(formattedComic);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du comic",
      error: error.message,
    });
  }
});
// Cette route trouve les comics contenant le personnage dont l'id est donné en params
router.get("/character/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=${process.env.API_KEY}`
    );
    // console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.message) {
      return res.status(500).json({ message: error.message });
    } else if (error.response) {
      return res.status(500).json({ message: error.response });
    }
  }
});

module.exports = router;
