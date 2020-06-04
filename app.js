const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require("mongoose"),
        Campground      = require("./models/campground"),
        Comment         = require("./models/comment"),
        User            = require("./models/user"),
        passport        = require("passport"),
        localStrategy   = require("passport-local"),
        methodOverride  = require("method-override"),
        flash           = require("connect-flash"),
        seedDB          = require("./seeds");

//Require Routes
const   commentRoutes       = require("./routes/comments"),
        campgroundsRoutes   = require("./routes/campgrounds"),
        indexRoutes         = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_2", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "My name is Mudin",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PASS CURRENT USER TO EACH ROUTE AUTOMATICALLY
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundsRoutes);

app.listen(3000, function(){
    console.log ("YelpCamp Server Started");
});