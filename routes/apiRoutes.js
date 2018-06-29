var express = require("express");
var router = express.Router();
var Story = require("../models/Story");

//router.get("/", function(req, res){
 //   res.send("yay");
//});



// //get all stories from db and display on web page in json format
// router.get("/stories", function (req, res) {
//     db.Story.find()
//     .then(function(stories){
//         console.log("stories", stories)
//         let hbsObject = {
//             stories: stories
//         };

//     })

//     Story.find({}), function (error, data) {
//         if (error) {
//             console.log("this is the error" + error);
//         } else {
//             res.json(data);
//         }
//     }
// });

// //get story by id
// router.get('/stories/:id', function (req, res) {
//     Story.findOne({ _id: req.params.id })
//         .populate("comments")
//         .exec(function (error, data) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 res.json(data);
//             }
//         });
// });

// // Route for saving/updating a stories comment
// router.post('stories/:id', function (req, res) {
//     Story.findOneAndUpdate({
//         _id: req.params.id
//     }, {
//             saved: true
//         })
//         .exec(function (error, data) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 res.json(data);
//             }
//         });
// });

// //delete story 
// router.delete('stories/delete/:id', function (req, res) {
//     console.log("deleted");

// })





module.exports = router;