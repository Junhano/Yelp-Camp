var express = require('express')
var Campground = require('../models/Campground')
var Comment = require('../models/Comment')
var router = express.Router()
var middleware = require('../middleware') 

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'junhano', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



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


router.post('/campgrounds', middleware.isLoggedIn, upload.single('image'), function(req, res){
	cloudinary.uploader.upload(req.file.path, function(result) {
	  // add cloudinary url for the image to the campground object under image property
	  req.body.campground.image = result.secure_url;
	  // add author to campground
	  req.body.campground.author = {
		id: req.user._id,
		username: req.user.username
	  }
	  Campground.create(req.body.campground, function(err, campground) {
		if (err) {
		  req.flash('error', err.message);
		  return res.redirect('back');
		}
		res.redirect('/campgrounds/' + campground.id);
	  });
	});
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
		Comment.deleteMany( {_id: { $in: element.comment } }, (err) => {
		if (err) {
			console.log(err);
		}
		res.redirect("/campgrounds");
		})
	})
})

	


module.exports = router;
