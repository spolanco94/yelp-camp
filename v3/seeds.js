var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    {
        name: "Hubert's Cove",
        image: "https://farm4.staticflickr.com/3544/3871329595_bb78425938.jpg",
        Description: "Only for Hubert, go away!"
    },
    {
        name: "Shibe Gathering",
        image: "https://farm4.staticflickr.com/3149/3062180144_ee0d2d466a.jpg",
        Description: "Let us bow our heads for the one and only true Shibe, Hubert!"
    },
    {
        name: "Doggo Manor",
        image: "https://farm1.staticflickr.com/55/113639275_a7466643a0.jpg",
        Description: "Count Hubert shall feast upon fellow shibe acolytes!"
    }
]

function seedDB(){
    // REMOVE ALL CAMPGROUNDS  
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("Removed campgrounds!");
        // CREATE CAMPGROUNDS
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("Created campground!");
                    // GENERATE COMMENTS
                    Comment.create(
                        {
                            text: "Whoa this was so scary! He really tried to bite me!",
                            author: "Susan"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!");
                            }
                        });
                }
            });
        });
    });
    
    
}

module.exports = seedDB;