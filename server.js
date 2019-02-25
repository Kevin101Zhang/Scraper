var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var PORT = 3000;

var db = require("./modal");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/ScraperDatabase", {
    useNewUrlParser: true
});

app.get("/scrape", function (req, res) {

    axios.get("https://old.reddit.com/r/webdev").then(function (response) {

        var $ = cheerio.load(response.data);

        $("p.title").each(function (i, element) {

            var result = {};

            result.title = $(this).text();
            result.link = $(this).children().attr("href");
            result.summary = 

            db.create(result)
                .then(function (addedResult) {
                    console.log("THIS IS THE ADDED RESULT\n")
                    console.log(addedResult);
                })
                .catch(function (err) {
                    console.log("THERE IS AN ERROR\n")
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});

app.get("/", function(req, res) {
    // Find all ScrapedModals
    db.find({})
      .then(function(ResultingInfo) {
        // If all ScrapedModals are successfully found, send them back to the client

        // res.json(ResultingInfo);
        res.render("index", { scrapedmodals: ResultingInfo });
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});