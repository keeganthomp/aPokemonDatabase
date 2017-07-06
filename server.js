const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.Promise = require("bluebird");
const mustache = require("mustache-express");
const dbUrl = "mongodb://localhost:27017/pokemon";
const Pokemon = require('./models/Pokemon');
const app = express();
const port = process.env.PORT || 8000;                                  

app.engine("mustache", mustache());
app.set("view engine", "mustache");
app.set("views", "./views");


//MIDDLEWARE
app.use(bodyParser.json());


//DB CONNECTION
mongoose.connect(dbUrl).then((err, db) => {
  if (err) {
    console.log("ERROR", err);
  }
  console.log("Connected to the DB");
});


//ROUTES
app.get("/pokemon", (req, res)=>{
    pokemon.find().then(foundPokes=>{
        res.send(foundPokes);
    }).catch(err =>{
        res.send(err);
    })
})





//LISTEN
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});