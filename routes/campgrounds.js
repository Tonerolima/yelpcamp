var express = require('express');
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require('../middleware');



router.get('/', function(req, res) {
    res.render('landing');
})


//INDEX ROUTE
router.get('/campgrounds', function(req, res) {
    //get campgrounds from db
    Campground.find({}, function(err, campground) {
        if (err) {
            res.render("Error connecting to the database")
        } else {
            //render campgrounds
            res.render('index', { campgrounds: campground });
        }
    })

})


//NEW ROUTE
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res) {
    res.render('new')
})


//CREATE ROUTE
router.post('/campgrounds', middleware.isLoggedIn, function(req, res) {
    //get data from page
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author_id = req.user._id;
    var author_username = req.user.username;

    Campground.create({
        name: name,
        image: image,
        description: description,
        author: {
            id: author_id,
            username: author_username
        }
    }, function(err, campground) {
        if (err) {
            console.log("Oh no, error")
            console.log(err);
        } else {
            //redirect back to campgrounds
            req.flash('success', 'New campground created');
            res.redirect('/campgrounds/' + campground._id);
        }
    })

})


//SHOW ROUTE
router.get('/campgrounds/:id', middleware.isLoggedIn, function(req, res) {
    // console.log(id);
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err) {
            console.log(err)
        } else {
            // console.log(campground)
            res.render('show', { campground: campground })
        }
    })
})


//EDIT ROUTE
router.get('/campgrounds/:id/edit', middleware.verifyCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render('edit', { campground: campground });
    })
})


//UPDATE ROUTE
router.put('/campgrounds/:id', middleware.verifyCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if (err) {
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            req.flash('success', 'Campground updated')
            res.redirect('/campgrounds/' + campground._id);
        }
    })
})


//DELETE ROUTE
router.delete('/campgrounds/:id', middleware.verifyCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            req.flash('success', 'Campground deleted')
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;