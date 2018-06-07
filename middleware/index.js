var Comment = require('../models/comment');
var Campground = require('../models/campgrounds');

var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'Please log in');
        res.render('login', { source: req.path });
    }
}


middlewareObject.verifyCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //Fetch the campground
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                res.redirect('back');
            } else {
                //check if user owns the campground
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permision to do that');
                    return res.redirect('/campgrounds/' + req.params.id);
                }

            }
        })
    } else {
        req.flash('error', 'Please log in');
        res.render('login', { source: req.path });
    }
};


middlewareObject.verifyCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //Fetch the campground
        Comment.findById(req.params.commentid, function(err, comment) {
            if (err) {
                res.redirect('back');
            } else {
                //check if user owns the comment
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permision to do that');
                    res.redirect('back');
                }

            }
        })
    } else {
        req.flash('error', 'Please log in');
        res.render('login', { source: req.path });
    }
};

module.exports = middlewareObject;