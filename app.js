var express     = require("express"),
    app         = express(),
    flash       = require('connect-flash'),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport	= require('passport'),
    localStrategy =	 require('passport-local'),
    Campground  = require("./models/campgrounds"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    User		= require('./models/user'),
    methodOverride  =   require("method-override");


var commentRoutes   =   require('./routes/comments')
var campgroundsRoutes   =   require('./routes/campgrounds')
var indexRoutes   =   require('./routes/index')

    
// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(methodOverride("_method"));
app.use(flash());

//Connect to mongodb
mongoose.connect("mongodb://localhost/yelp_camp_v4");


//Passport configuration
app.use(require('express-session')({
	secret: 'I have been to jail once',
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);


app.listen(8080, function(){
    console.log("YelpCamp is now live!!!")
})