const   Campground    = require("../models/campground"),
        Comment       = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
    //if not, redirect
        req.flash("error", "Please log in first.");
        res.redirect("/login")
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
    //if not, redirect
        req.flash("error", "Please log in first.");
        res.redirect("/login")
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first.");
    res.redirect("/login");
}

module.exports = middlewareObj