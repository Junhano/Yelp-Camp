const express = require('express'),
      Campground = require('../models/Campground'),
      Comment = require('../models/Comment'),
      router = express.Router(),
      middleware = require('../middleware'), 
      multer = require('multer')
	  
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
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
	  req.body.campground.imageID = result.public_id;
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

router.put('/campgrounds/:id', middleware.checkCampgroundOwnerShip, upload.single('image'), async function(req, res){
	
	Campground.findById(req.params.id, async function(err, element){
		if (err){
			res.redirect('back')
		}
		else{
			if (req.file){
				try{
					await cloudinary.uploader.destroy(element.imageID);
					let result = await cloudinary.uploader.upload(req.file.path);
					element.image = result.secure_url;
					element.imageID = result.public_id;
				}
				catch{
					res.redirect('back');
				}
				
			}
			element.name = req.body.name;
			element.price = req.body.price;
			element.description = req.body.description;
			element.save();
			res.redirect('/campgrounds/' + req.params.id)
		}
	})

})

router.delete('/campgrounds/:id', middleware.checkCampgroundOwnerShip, function(req, res){
	Campground.findByIdAndDelete(req.params.id, async function(err, element){
		if(err){
			console.log(err)
		}
		
		try{
			await cloudinary.uploader.destroy(element.imageID);
		}
		catch{
			console.log('err')	
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
