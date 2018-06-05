var express = require('express');
var router  = express.Router();
var Campground  = require("../models/campgrounds");
var Comment     = require("../models/comment");
var middleware   =   require('../middleware');


router.post('/campgrounds/:id/comments', middleware.isLoggedIn, function(req, res){
    //Find campground by ID
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            res.send("The referenced campground cannot be found")
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    res.send("Could not add comment")
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    //Add comment to campground and save
                    camp.comments.push(newComment);
                    camp.save();
                    //Redirect back to the show page
                    res.redirect("/campgrounds/"+req.params.id);
                }
            })
        }
    })
})



router.get('/campgrounds/:id/comments/:commentid/edit', middleware.verifyCommentOwnership, function(req, res){
    Comment.findById(req.params.commentid, function(err, comment){
        if(err){
            res.redirect('back')
        } else {
            res.render('editComment', {comment: comment, campgroundId: req.params.id});
        }
    })
})



router.put('/campgrounds/:id/comments/:commentid', middleware.verifyCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, comment){
        if(err){
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})


router.delete('/campgrounds/:id/comments/:commentid', middleware.verifyCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.commentid, function(err){
        res.redirect('back');
    })
})


// function verifyOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         //Fetch the campground
//         Comment.findById(req.params.commentid, function(err, comment){
//             if(err){
//                 res.redirect('back');
//             } else {
//                 //check if user owns the comment
//                 if(comment.author.id.equals(req.user._id)){
//                     next();
//                 } else{
//                     res.redirect('back');
//                 }
                
//             }
//         })
//     } else {
//         res.redirect('/login');
//     }
// }



// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     } else {
//         res.redirect('/login');
//     }
// }

module.exports = router;