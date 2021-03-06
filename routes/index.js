'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var async = require('async');
var bcrypt = require('bcrypt');
var models = require('../models/index'),
    User = models.User

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


////////// AUTH ROUTES //////////

// LOG IN
router.route('/login').
  post(passport.authenticate('local'), function(req, res){
    res.sendStatus(201);
  });


// SIGN UP
router.route('/signup').
  get(function(req, res, next) {
    res.sendStatus(405);
  }).
  post(function(req, res, next) {
    if(!req.body || !req.body.email || !req.body.password) {
      var err = new Error("No credentials.");
      return next(err);
    }

    if (req.body.password.length < 6) {
      var err = new Error("Password must be 6 or more characters.");
      return next(err);
    }

    async.waterfall([
      function(cb) {
        bcrypt.genSalt(16, cb);
      },
      function(salt, cb) {
        bcrypt.hash(req.body.password, salt, cb);
      },
      function(hash, cb) {
        User.create({
          email : req.body.email,
          password : hash
        }).then(function(user) {
          cb(null, user);
        }, function(err){
          console.log(err);
          cb(err);
        });
      }
    ], function(err, result) {
      if (err) {
        res.status(400).send(err);
      }

      next();
    });
  }, passport.authenticate('local'), function(req, res){
    res.sendStatus(201);
  });



// CHANGE PASSWORD



// LOG OUT
router.route('/logout').
  all(function(req, res, next) {
    req.session.destroy(function(err){
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.sendStatus(200);
    });
  });


module.exports = router;
