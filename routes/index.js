var express = require('express');
var router 	= express.Router();
var User		= require('../models/user');
var passport = require('passport');


//Show register form
router.get('/register', function(req, res){
	res.render('register', {currentUser: req.user});
})

//Sign up logic
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.render('register');
		} else{
			passport.authenticate('local')(req, res, function(){
				res.redirect('/campgrounds');
			})
		}
	})
})


//show login form
router.get('/login', function(req, res){
	res.render('login');
})

//Login logic, using a middleware
router.post('/login', passport.authenticate('local', 
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), function(req, res){
})

//Logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have been logged out');
	res.redirect('/campgrounds');
})

module.exports = router;