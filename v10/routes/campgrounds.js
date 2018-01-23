var express         = require("express");
var Campground      = require("../models/campground");
var router          = express.Router();
var middleware      = require("../middleware/");

//Index - Show all Campgrounds
router.get("/", function(req, res) {
    //Get all campgrounds from db
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }
    }); 

});

//Create - Add new Campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = { name: name, image: image, description: desc, author: author };
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - Display form to create a new Campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            //render show template 
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//Edit Campground Route
router.get("/:id/edit", middleware.campgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//Update Campground Route
router.put("/:id", middleware.campgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("campgrounds");
        } else {
            //redirect somewhere
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Campground Route
router.delete("/:id", middleware.campgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;