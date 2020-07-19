var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var mongoose = require('mongoose')
var Campground = require('./models/Campground')
var Comment = require('./models/Comment')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var User = require('./models/User')
var seedDB = require('./seeds')
var methodOverride = require('method-override')
var flash = require('connect-flash')

var commentRoute = require('./routes/comment'),
	campgroundRoute = require('./routes/campground'),
	indexRoute = require('./routes/index')
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser:true})


//seedDB();

app.use(bodyParser.urlencoded({extended: true}))


//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "LOL YELP",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))

app.use(flash())

app.use((req, res, next) => {
  	res.locals.currentUser = req.user; // req.user is an authenticated user
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
  	next();
});




app.use(commentRoute)
app.use(campgroundRoute)
app.use(indexRoute)


app.listen(3000, function(){
	console.log('Yelp Camp server starts')
})


