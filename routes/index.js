const express = require('express'),
	  router = express.Router(),
	  User = require('../models/User'),
	  passport = require('passport'),
	  middleware = require('../middleware') 

router.get('/', function(req,res){
	res.render('home')
})


router.get('/user', middleware.isLoggedIn, function(req,res){
	res.render('user')
})

//Auth
router.get('/register', function(req, res){
	res.render('register')
})

router.post('/register', function(req, res){
	User.register(new User({username: req.body.username, profilepic: false, profile: {img: "", imageID: ""}}), req.body.password, function(err, user){
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

router.post("/login",passport.authenticate("local",{
    failureRedirect: "/login", failureFlash: true
}),(req,res)=>{
    let redirectTo = req.session.redirectTo || "/campgrounds" ;
    delete req.session.redirectTo;
    res.redirect(redirectTo)
});

router.get('/logout', function(req, res){
	req.flash('success', 'You have logged out')
	req.logout();
	res.redirect('/')
})



module.exports = router;
