var middlewareObj = {}
var Comment = require('../models/Comment')
var Campground = require('../models/Campground')
var User = require('../models/User')

middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to log in to do that')
	res.redirect('/login')
}

middlewareObj.checkCommentOwnerShip = function(req, res, next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.ids, (err, foundComment) => {
		  if (err) {
			res.redirect("back");
		  } else {
			if (!foundComment) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
			// does the user own the comment
			if (foundComment.author.id.equals(req.user._id)) {
				next(); 
			}
			else {
				req.flash('error', 'You don\'t have permission to do that')
			  res.redirect("back");
			}
		  }
		});
	  }
	  else {
			req.flash('error', 'You need to log in to do that')
			res.redirect("/login");
	  }
}

middlewareObj.checkCampgroundOwnerShip = function(req, res, next){
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) => {
		  if (err) {
			res.redirect("back");
		  } else {
			// does the user own the comment
			 
            if (!foundCamp) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			if (foundCamp.author.id.equals(req.user._id)) {
				next(); 
			}
			else {
				req.flash('error', 'You don\'t have permission to do that')
			  	res.redirect("back");
			}
		  }
		});
	  }
	  else {
		  	req.flash('error', 'You need to log in to do that')
			res.redirect("/login");
	  }
}



module.exports = middlewareObj