// for router, we need to require express again 
var express = require("express");
//router will serve as a container as all routes to use later in the server 
var router = express.Router();
// require cheerio on html routes for scraping 
var cheerio = require("cheerio");
//for server side ajax request 
var request = require("request");

//require models 
var db = require("../models");

let url = "https://techcrunch.com/";
//since we have two instances of express -- one in server and one in htmlRoutes we want to send this route back to our server.js file where the server is listening
router.get("/scrape", function (req, res) {
    //store all stories in an empty array 
    var allStories = [];
    //add request to site we want to scrape 
    request(url, function (err, response, body) {
        if (err) console.log(err);

        let $ = cheerio.load(body)
        // select the parent div 
        let stories = $(".post-block");
        //jquery loop to scrap html
        stories.each(function (i, story) {
            let oneStory = {
                title: $(story).children(".post-block__header").children(".post-block__title").text().trim(),
                author: $(story).children(".post-block__header").children(".post-block__meta").children(".river-byline").children(".river-byline__authors").text().replace(/\t/g, "").replace(/\n/g, " ").trim(), //when there are multiple authors we need to remove the extra text returned 
                url: $(story).children(".post-block__header").children(".post-block__title").children(".post-block__title__link").attr("href"),
                content: $(story).children(".post-block__content").text().trim(),
                img: $(story).children(".post-block__footer").children().children().children("img").attr("src")
            }
            
            //send to db -- create an article in tcArticles collection
            db.Story.create(oneStory)
                .catch(function (err) {
                    console.log("scrape was successful. Not posting duplicates to db when article is scraped again 🖖");
                });
        });
    });
    //when scrape is complete
    res.send("Scrape Complete")
});

//when home page loads, get all articles from the db
router.get("/", function(req, res){ 
    //grab all documents
    db.Story.find().sort({date: -1})
    .then(function(stories){
        let allStories = {
            stories: stories
        };
        //console.log("stories", allStories);
        res.render("index", allStories);
    })
    .catch(function(err){
        res.json(err);
    });
});

//route to render the saved articles 
router.get("/stories", function(req, res){
    db.Story.find({
        "saved": true
    })
    .populate("notes")
    .exec(function(err, stories){
        let allStories = {
            stories: stories
        };
    res.render("saved", allStories);
    });
});

//route to get saved story by id 
router.get("/stories/:id", function (req,res){
    db.Story.findOne({
        "_id": req.params.id
    })
    .populate("notes")
    .exec(function(err, stories){
        if (err) {
            console.log(err);
        }
        else {
            res.json(stories);
        }
    });
});

// save story 
router.post("/stories/save/:id", function (req,res){
    db.Story.findOneAndUpdate({
        "_id": req.params.id
    }, {
        "saved": true
    })
    .exec(function(err, stories){
        if (err) {
            console.log(err);
        }
        else {
            res.json(stories);
        }
    });
});

//delete story 
router.post("/stories/delete/:id", function (req,res){
    console.log("deleted");

    db.Story.findOneAndUpdate({
        "_id": req.params.id
    }, {
        "saved": false
    })
    .exec(function(err, stories){
        if (err) {
            console.log(err);
        }
        else {
            res.json(stories);
        }
    });
});

//add notes to an article 
router.post("/notes/save/:id", function (req,res){
    console.log("notes added");
    var newNotes = new Notes({
        body: req.body.text,
        article: req.params.id
    });
    newNotes.save(function (err, notes){
        console.log(notes.body);
        if (err){
            console.log(err)
        }else {
            db.Story.findOneAndUpdate({
                "_id": req.params.id
            }, {
                $push: {
                    "notes": notes
                }
            })
            .exec(function(err, notes){
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(notes);
                }
            });
        }
    });    
});

//delete notes from an article 
router.delete("/notes/delete/:notes_id/:stories_id", function (req,res){
    Notes.findOneAndRemove({
        "_id": req.params.notes_id
    }, function (err){
        if (err){
            conosole.log(err);
            res.send(err);
        }else{
            db.Stories.findOneAndUpdate({
                "_id": req.params.notes_id
            }, {
                $pull: {
                    "notes": req.params.stories_id
                }
            })
            .exec(function (err){
                if (err){
                    console.log(err);
                    res.send(err)
                } else {
                    res.send("Note Deleted!");
                }
            });
        }
    });
});
    

// export to use in server.js 
module.exports = router;