const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        User        = require("../models/user");


router.get("/", function(req, res){
    res.render("landing");
});

//==========
//AUTH ROUTES
//==========
//show register form
router.get("/register", function(req, res){
    res.render("register");
});
//handle register logic
router.post("/register", function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", `Welcome to YelpCamp, ${user.username}!`);
                res.redirect("campgrounds");
            });
        }
    });
});

//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});
//LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged Out.");
    res.redirect("/campgrounds");
});

module.exports = router;