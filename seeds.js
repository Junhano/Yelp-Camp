var mongoose = require('mongoose');
var Campground = require('./models/Campground')
var Comment = require('./models/Comment')

var data1 = [
	{name: "test", image: 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350', description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."},
	{name: "test2", image: 'https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350', description: "TEST DE1S"},
	{name: "test3", image: 'https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350', description: "TEST DE131S"}
]

function seedDB(){
	Campground.deleteMany({}, function(err){
	if (err){
		console.log(err)
	}
	else{
		console.log('Remove')
		Comment.deleteMany({},function(err){
			if (err){
				console.log(err)
			}
		})
		
/*
		data1.forEach(function(data2){
		Campground.create(data2, function(err,campgrounds){
		if (err){
			console.log(err)
		}
		else{
			console.log('SUCCEED')
			Comment.deleteMany({}, function(err){
				if (err){
					console.log(err)
				}
				else{
					Comment.create(
					{text: "The Campground is good, no WIFI though", author: "Jimmy Choo"}, function(err, data){
						if (err){
							console.log(err)
						}
						else{
							console.log("SUCCEED ADD COMMENT")
							campgrounds.comment.push(data)
							campgrounds.save()
							console.log("SUCCEED ADD COMMENT IN CAMPGROUND")
						}
					}
				)				
				}
			})

		}
		});
	})
*/
	}
	})

}

module.exports = seedDB