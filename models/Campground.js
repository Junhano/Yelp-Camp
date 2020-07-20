var mongoose = require('mongoose')

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: Number,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		name: String
	},
	comment: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})

module.exports = mongoose.model("Campground", campgroundSchema);