var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScrapeSchema = new Schema({
    link: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,

    },
    summary: {
        type: String,
        trim: true,
    }
});

var ScrapedModal = mongoose.model("ScrapedModal", ScrapeSchema);
module.exports = ScrapedModal;