var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScrapeSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    link: {
        type: String,
        trim: true,
    },
    summary: {
        type: String,
        trim: true,
    },
    tags: {
        type: String,
        trim: true,
    },
    relativeTime: {
        type: String,
        trim: true,
    },
    absoluteTime: {
        type: String,
        trim: true,
    },
    userProfileLink: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        trim: true,
    },
    userReputationScore: {
        type: String,
        trim: true,
    },
    views: {
        type: String,
        trim: true,
    },
    votes: {
        type: String,
        trim: true,
    },
    answers: {
        type: String,
        trim: true,
    },
    commentArr: [{
        type: String,
        trim: true,
    }]
});

var ScrapedModal = mongoose.model("ScrapedModal", ScrapeSchema);
module.exports = ScrapedModal;