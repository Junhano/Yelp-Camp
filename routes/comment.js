const express = require('express'),
	  Campground = require('../models/Campground'),
	  Comment = require('../models/Comment'),
	  router = express.Router(),
	  middleware = require('../middleware') 

//comment route
router.get('/campgrounds/:id/comment/new', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err)
		}
		else{
			res.render('comment/new', {element: campground, currentUser: req.user})
		}
	})
	
})

router.post('/campgrounds/:id/comment', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		
		if (err){
			console.log(err);
		}
		else{
			Comment.create({text: req.body.comment, rating: req.body.ratingstar, author: {id: req.user, username: req.user.username}}, function(err, newcomment){
				if (err){
					console.log(err)
				}
				else{
					campground.comment.push(newcomment);
					campground.save();
					res.redirect('/campgrounds/' + req.params.id)
				}
			})
		}
	})
})

router.get('/campgrounds/:id/comment/:ids/edit', middleware.checkCommentOwnerShip, function(req, res){
	Comment.findById(req.params.ids, function(err, element){
		res.render('comment/edit', {campground: req.params.id, element: element})
	})
		
})

router.put('/campgrounds/:id/comment/:ids', middleware.checkCommentOwnerShip, function(req, res){
	Comment.findByIdAndUpdate(req.params.ids, req.body.comment, function(err, element){
		if (err){
			res.redirect('/campgrounds')
		}
		else{
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

router.delete('/campgrounds/:id/comment/:ids', middleware.checkCommentOwnerShip, function(req, res){
	Comment.findByIdAndDelete(req.params.ids, function(err, element){
		if(err){
			console.log(err)
		}
		else{
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})






module.exports = router;
