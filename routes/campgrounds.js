const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");
        
//CAMPGROUND ROUTES
router.get("/campgrounds", function(req, res){
    //Get campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

//NEW Restful Route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREATE Restful Route
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    //get data from form and add data to campgrounds
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, price: price, author:author}
    //Create new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else{
            //redirect back to campgrounds page
            res.redirect("campgrounds");
        }
    });
});

//Show more info on one campground
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
        });
});

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//DESTROY Campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds`);
        }
    });
});

module.exports = router;