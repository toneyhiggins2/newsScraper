var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

// import dbs
var db = require("./models")

// Initialize Express
var app = express();

// Configure middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } );


// Import routes and give the server access to them.
var routes = require("./controllers/articleController.js");

app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});