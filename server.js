const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.Promise = require("bluebird");
const mustache = require("mustache-express");
const dbUrl = "mongodb://localhost:27017/pokemon";
const Pokemon = require("./models/Pokemon");
const app = express();
const port = process.env.PORT || 8000;

app.engine("mustache", mustache());
app.set("view engine", "mustache");
app.set("views", "./views");

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB CONNECTION
mongoose.connect(dbUrl).then((err, db) => {
  if (err) {
    console.log("ERROR", err);
  }
  console.log("Connected to the DB");
});

//ROUTES
app.get("/pokemon", (req, res) => {
  pokemon
    .find()
    .then(foundPokes => {
      res.send(foundPokes);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/pokemon", (req, res) => {
  let pokemonData = req.body;
  console.log(pokemonData);
  let newPokemon = new Pokemon(pokemonData);
  newPokemon
    .save()
    .then(savedPokemon => {
      res.send(savedPokemon);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/pokemon/:name", (req, res) => {
  Pokemon
    .findOne({ name: req.params.name }, req.body)
    .then(foundPokemon => {
      res.render("updatePokemon", {foundPokemon: foundPokemon});
    });
});

app.post("/pokemon/:id", (req, res) => {
  Pokemon.updateOne({ _id: req.params.id }, req.body)
    .then(updatedPokemon => {
      res.send(updatedPokemon);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//LISTEN
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
