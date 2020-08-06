const express = require('express'),
	  router = express.Router(),
	  middleware = require('../middleware'),
	  User = require('../models/User'),
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







router.post('/profilepic', upload.single('imagesrc'), function(req, res){
	User.findById(req.user._id, function(err, user){
		if (err){
			console.log(err)
			res.redirect('back') 
		}
		else{
			cloudinary.uploader.upload(req.file.path, function(result) {
				  user.profile.img= result.secure_url;
				  user.profile.imageID = result.public_id;
				  user.profilepic = true;
				  user.save()
				  res.redirect('/user')
			})
		}
	})
})

router.put('/profilepic', upload.single('imagesrc'), function(req, res){
	User.findById(req.user._id, async function(err, user){
	if (err){
		console.log(err)
		res.redirect('back')
	}
	else{
		await cloudinary.uploader.destroy(user.profile.imageID)
		cloudinary.uploader.upload(req.file.path, function(result){
			user.profile.img= result.secure_url;
			user.profile.imageID = result.public_id;
			user.save()
			res.redirect('/user')
		})
	}
})
})

router.delete('/profilepic', function(req, res){
	User.findById(req.user._id, async function(err, user){
		if (err){
			console.log(err)
			res.redirect('back')
		}
		else{
			await cloudinary.uploader.destroy(user.profile.imageID)
			user.profile.img = ""
			user.profile.imageID = ""
			user.profilepic = false;
			user.save()
			res.redirect('/user')
		}
	})
})

module.exports = router;
