var express = require('express');
var router = express.Router();
var models = require('../models/index');

// DISPLAY USER INFO
router.route('/')
  .all(function(req, res, next) {
    if (!req.user) {
      var err = new Error("Log in first.");
      return next(err);
    }
    next();
  })
  .get(function(req, res){
    res.send({user: req.user});
  });


// UPDATE USER INFO
router.route('/edit')
  .patch(function(req, res){
    console.log(req.body);
    req.user.update({
      email: req.body.email
    }).then(function(user){
      // console.log(user);
      res.send({user: req.user});
    }, function(err){
      res.sendStatus(500);
    });
  });


// DISPLAY FAVORITES
router.route('/favorites')
  .get(function(req, res){
    models.Favorite.findAll({
      where : {
        UserId : req.user.id
      }
    }).then(function(favorites){
      res.send(favorites);
    }, function(err){
      res.sendStatus(500);
    });
  })


// ADD A FAVORITE
  .post(function(req, res){
    models.Favorite.create({
      yelp_id : req.body.yelp_id,
      UserId : req.user.id
    }).then(function(favorite){
      res.send(favorite);
    }, function(err) {
      res.sendStatus(500);
    });
  })


// DELETE A FAVORITE


module.exports = router;
