var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

// Import the model (cat.js) to use its database functions.
var db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {
  db.Article.find({}).then((data) => {
    res.render("index", { article: data });
  });
});


// A GET route for scraping the /r/LiverpoolFC
router.get("/scrape", (req, res) => {
  // First, we grab the body of the html with axios
  axios.get("https://www.cnet.com/news/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every div with a top-matter class, and do the following:
    $(".riverPost").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // filter on just media links
      // Add the text and href of every link, and save them as properties of the result object
      result.topicName = $(this).children(".assetText").children(".byline").children("a").text();
      result.link = $(this).children(".assetText").children("h3").children("a").attr("href");

      console.log("This is the result: ",  result);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (article) {
          // View the added result in the console
          console.log(article)
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.status(200).send("Scrape Complete");
  });
});

router.get("/comments/:id", (req, res) => {

  let articleId = req.params.id;
  console.log(articleId);
  db.Article.findById(articleId)
    .populate("comment")
    .then((article) => {
      console.log(article.comment)
      res.json(article.comment)
    })
});


router.post("/comments/:id", (req, res) => {

  console.log(req.body)

  db.Comment.create(req.body)
    .then((comment) => {
      return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: { comment: comment._id }} , {new: true});
    })
    .then((added)=> res.status(200).send(`Comment added: ${added}`))
    .catch(err => res.status(500).send(err))
});


// Export routes for server.js to use.
module.exports = router;