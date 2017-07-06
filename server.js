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
app.use("/", express.static("public"));

//DB CONNECTION
mongoose.connect(dbUrl).then((err, db) => {
  if (err) {
    console.log("ERROR", err);
  }
  console.log("Connected to the DB");
});


app.get("/pokemon", (req, res) => {
  Pokemon.find().then(allPokemon => {
  res.render("pokedex", {allPokemon: allPokemon} );
  }).catch(err=>{
    res.send(err);
  })
});

app.get("/", (req, res)=>{
  res.render("index");
})


app.get("/newPokemon", (req,res)=>{
  res.render("newPokemon");
});

app.post("/pokemon", (req, res) => {
  let pokemonData = req.body;
  console.log(pokemonData);
  let newPokemon = new Pokemon(pokemonData);
  newPokemon
    .save()
    .then(savedPokemon => {
      res.redirect("/pokemon");
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

app.post("/pokemon/:name", (req, res) => {
  Pokemon.updateOne({ name: req.params.name }, req.body)
    .then(updatedPokemon => {
      res.redirect();
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/delete/:id", (req, res) => {
  Pokemon.deleteOne({_id: req.params.id })
    .then(() => {
      res.redirect("/pokemon")
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//LISTEN
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
