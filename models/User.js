var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	profile: {
		img: String,
		imageID: String
	},
	profilepic: Boolean
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);