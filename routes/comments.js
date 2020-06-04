const   express = require("express"),
        router  = express.Router(),
        Campground = require("../models/campground"),
        Comment = require("../models/comment"),
        middleware  = require("../middleware");
        
//New Comments
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

//Create Comments
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    res.redirect("/campgrounds");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment posted.");
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground){
            req.flash("error", "Campground not found.");
            res.redirect("back");
        }
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err){
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                    res.redirect("/campgrounds");
                } else {
                    res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
                }
            });
    });
});

router.put("/campgrounds/:id/comments/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//DESTROY Campground route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment Deleted.");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;