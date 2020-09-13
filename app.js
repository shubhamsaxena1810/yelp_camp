var express     =require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var passport    = require("passport");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User                  = require("./models/user");
var methodOverride = require("method-override")
var Campground = require("./models/campground");
var Comment     = require("./models/comments");
var seedDB      = require("./seeds")
var flash       = require("connect-flash");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => {
	console.log("Connected to db");
}).catch(err => {
	console.log("Error:", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the database
//seedDB();

app.use(require("express-session")({
	secret: "Rusty is best",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT || 3002 ,process.env.IP,function(){
    console.log("YelpCamp server has Started");
});