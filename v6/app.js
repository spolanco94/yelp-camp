var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Hewie loves cheese and lambchop!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render("landing");
});

//Index - Show all Campgrounds
app.get("/campgrounds", function(req, res) {
    //Get all campgrounds from db
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }
    })
    // 

});

//Create - Add new Campgrounds to DB
app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };

    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

//NEW - Display form to create a new Campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
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

// =================================
// COMMENTS ROUTES
// =================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground})
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
            
        }
    })
    
    
})

//==========================
//AUTH ROUTES
//==========================
//Show register from
app.get("/register", function(req, res){
    res.render("register");
});

//Handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
app.get("/login", function(req, res){
    res.render("login"); 
});

//Handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});

//Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Started");
});
