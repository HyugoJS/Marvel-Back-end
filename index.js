require("dotenv").config();
const express = require("express"); // import du package express
const app = express(); // création du serveur
const cors = require("cors");

app.use(express.json()); // param body
app.use(cors());

const comicsRoute = require("./routes/comics");
const charactersRoute = require("./routes/characters");

app.use(comicsRoute);
app.use(charactersRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome on my marvel server" });
});

app.all("*", (req, res) => {
  // route en GET dont le chemin est /hello
  res.status(404).json("Not found");
});

app.listen(process.env.PORT, () => {
  // Mon serveur va écouter le port 3000
  console.log("Server has started"); // Quand je vais lancer ce serveur, la callback va être appelée
});
