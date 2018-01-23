var express         = require("express");
var router          = express.Router({mergeParams: true});
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var middleware      = require("../middleware/");

//Comments - New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground : campground});
        }
    });
});

//Comments - Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                } else {
                    //add username + id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    //connect new comment to campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
            
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", middleware.commentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground cannot be found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
            }
        });
    });
});

//Comment update route
router.put("/:comment_id", middleware.commentOwnership, function(req, res){
    // res.send("Comment update route");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment destroy route
router.delete("/:comment_id", middleware.commentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong, please try again!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;