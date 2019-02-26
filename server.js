var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var PORT = 3000;
var db = require("./modal");
var app = express();
// var path = require("path");
// var fs = require('fs');

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/ScraperDatabase", {
    useNewUrlParser: true
});

app.get("/", function (req, res) {

    axios.get("https://stackoverflow.com/questions/tagged/react").then(function (response) {

        var $ = cheerio.load(response.data);

        $("div.summary").each(function (i, element) {

            var result = {};

            // Title
            result.title = $(this).find("h3").text();

            // Link
            var link = $(this).children("h3").find("a").attr("href");
            result.link = "https://stackoverflow.com" + link;

            // Summary
            result.summary = $(this).find("div.excerpt").text();

            // Tags
            result.tags = $(this).find("div.tags").text();

            // Relative Time
            result.relativeTime = $(this).find("div.user-info ").find("div.user-action-time").text();

            // Absolute Time
            result.absoluteTime = $(this).find("div.user-info ").find("div.user-action-time").find("span").attr("title");

            // User Profile Link
            userProfileLink = $(this).find("div.user-info ").find("div.user-gravatar32").find("a").attr("href");
            result.userProfileLink = "https://stackoverflow.com" + userProfileLink;

            // User Name
            result.userName = $(this).find("div.user-info ").find("div.user-details").find("a").text();

            // User Reputation Score
            result.userReputationScore = $(this).find("div.user-info ").find("div.user-details").find("div.-flair").find("span.reputation-score").text();

            // Views
            result.views = $(this).prev().find("div.views").text();

            // Votes
            result.votes = $(this).prev().find("div.stats").find("div.vote").find("div.votes").find("span.vote-count-post").text();

            // Answers
            result.answers = $(this).prev().find("div.stats").find("div.status").find("strong").text();

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
    });

    db.find({})
        .then(function (ResultingInfo) {
            // If all ScrapedModals are successfully found, send them back to the client

            // res.json(ResultingInfo);
            res.render("index", {
                scrapedmodals: ResultingInfo
            });
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});


app.post("/submit", function (req, res) {

    db.create(req.body)
    console.log("THIS IS REQBODY\n")
    console.log(req.body)

    .then(function(Information) {
        console.log("This is DBNOT\n")
        console.log(Information)
        return db.findOneAndUpdate({where:{ link: Information.link}}, { $push: { commentArr: Information.newComment } }, { new: true });
        })
        .then(function (AddedComment) {
            res.json(AddedComment);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});