var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm6.staticflickr.com/5587/15112124021_e4e27994ae.jpg"},
    {name: "Lake Huggie", image: "https://farm3.staticflickr.com/2921/14702483174_19ca224e27.jpg"},
    {name: "Starry Nights", image: "https://farm5.staticflickr.com/4280/35363102462_19c9a5b1ee.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing")
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    
    campgrounds.push(newCampground);
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Started");
});