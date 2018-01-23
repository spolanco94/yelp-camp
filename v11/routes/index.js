var express         = require("express"),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    passport        = require("passport"),
    User            = require("../models/user");
    
var router = express.Router();

//Root route
router.get("/", function(req, res) {
    res.render("landing");
});

//Show register from
router.get("/register", function(req, res){
    res.render("register");
});

//Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to ShibaCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login"); 
});

//Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});

//Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;