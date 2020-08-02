const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    Campground = require('./models/Campground'),
    Comment = require('./models/Comment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/User'),
    seedDB = require('./seeds'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    commentRoute = require('./routes/comment'),
	campgroundRoute = require('./routes/campground'),
	indexRoute = require('./routes/index')

let url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url, 
{useNewUrlParser:true,
useUnifiedTopology: true
}).then(()=>{
	console.log("SUCCEED")
}).catch(err =>{
		 console.log(err.message)
	})
	
mongoose.set('useFindAndModify', false);


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


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});



