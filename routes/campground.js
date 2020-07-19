var express = require('express')
var Campground = require('../models/Campground')
var Comment = require('../models/Comment')
var router = express.Router()
var middleware = require('../middleware') 

router.get('/campgrounds', function(req, res){
	Campground.find({}, function(err, campgrounds){
		if (err){
			console.log(err)
		}
		else{
			res.render("campground/campgrounds", {name:campgrounds, currentUser: req.user})
		}
	})
})


router.post('/campgrounds', middleware.isLoggedIn, function(req, res){
	let title = req.body.name
	let src = req.body.image
	let des = req.body.des
	Campground.create({name:title, image:src, description:des, author: {id: req.user, name: req.user.username}}, function(err, campgrounds){
		if (err){
			console.log(err)
		}
		else{
			res.redirect('/campgrounds')
		}
	})

})

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render('campground/new', {currentUser: req.user})
})

router.get('/campgrounds/:id', function(req, res){
	
	let element = Campground.findById(req.params.id).populate("comment").exec(function(err, element){
		if (err){
			console.log('Error')
		}
		else{
			res.render('show', {element:element, currentUser: req.user})
		}
	})


})

router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnerShip, function(req, res){
	let element = Campground.findById(req.params.id, function(err, element){
		res.render('campground/update', {element: element})
	})
		
})

router.put('/campgrounds/:id', middleware.checkCampgroundOwnerShip, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, element){
		if (err){
			res.redirect('/campgrounds')
		}
		else{
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

router.delete('/campgrounds/:id', middleware.checkCampgroundOwnerShip, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err, element){
		if(err){
			console.log(err)
		}
		Comment.deleteMany( {_id: { $in: element.comments } }, (err) => {
		if (err) {
			console.log(err);
		}
		res.redirect("/campgrounds");
		})
	})
})

	


module.exports = router;
