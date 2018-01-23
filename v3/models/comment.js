var mongoose    = require("mongoose");
    // Campground  = require("./campground"),
    // Seeds     = require("../seeds");
    
var commentSchema = new mongoose.Schema ({
    text: String,
    author: String
    //created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comment", commentSchema);