var express = require('express')
var router = express.Router()
var User = require('../models/User')
var passport = require('passport')


router.get('/', function(req,res){
	res.render('home', {currentUser: req.user})
})



//Auth
router.get('/register', function(req, res){
	res.render('register')
})

router.post('/register', function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
		  req.flash("error", err.message);
		  return res.redirect("/register");
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to Yelp Camp ' + user.username)
			res.redirect('/campgrounds')
		})
	})
})

//Login
router.get('/login', function(req, res){
	res.render('login')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"}), function(req, res){
	
})

router.get('/logout', function(req, res){
	req.flash('success', 'You have logged out')
	req.logout();
	res.redirect('/')
})


module.exports = router;
