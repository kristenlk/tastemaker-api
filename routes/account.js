'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var async = require('async');

// DISPLAY USER INFO
router.route('/')
  .all(function(req, res, next) {
    if (!req.user) {
      var err = new Error("Please log in to continue.");
      return next(err);
    }
      next();
    // }
  })
  .get(function(req, res) {
    res.json({user: req.user});
  });


// UPDATE USER INFO
router.route('/edit')
  .patch(function(req, res) {
    console.log(req.body);
    req.user.update({
      email: req.body.email
    }).then(function(user) {
      // console.log(user);
      res.json({user: req.user});
    }, function(err) {
      res.sendStatus(500);
    });
  });


router.route('/favorites')
  //  Make sure user is logged in first
  .all(function(req, res, next) {
    if (!req.user) {
      var err = new Error("Please log in to continue.");
      // return next(err);
      console.log(err);
    } else {
      next();
    }
  })

// DISPLAY FAVORITES
  .get(function(req, res){
    async.waterfall([
      function(done){
        models.Favorite.findAll({ // Find all user's favorites
          where : {
            UserId : req.user.id
          }
        }).then(function(favorites){
          done(null, favorites);
        }, function(err){
          done(err);
        });
      },

      function(favorites, done){
        async.map(favorites, function(favorite, callback){
          favorite.getRestaurant().then(function(restaurant){
            // Add conditional query of Yelp API within display favorite / restaurant here. Will do later.
            // if (restaurant.createdAt)
            callback(null, restaurant);
          }, callback);
        }, function(err, result){
          if (err) {
            return done(err);
          }
          done(null, result);
        });
      }
    ], function(err, result){
      if (err) {
        return next(err);
      }
      res.json(result);
    });
  })



// ADD A FAVORITE
  .post(function(req, res, next) {
    async.waterfall([
      function(done){
        // A restaurant should only be created here if it doesn't already exist in the table
        console.log(req.body);
        models.Restaurant.findOrCreate({ // Create db row for restaurant that's being favorited
          where: {
            yelp_id: req.body.yelp_id,
            name: req.body.name,
            rating: req.body.rating,
            url: req.body.url,
            display_address: JSON.stringify(req.body.display_address),
            display_phone: req.body.display_phone,
            latitude: req.body.latitude.toString(),
            longitude: req.body.longitude.toString(),
            price: req.body.price
          }
        }).then(function(restaurant){
          console.log(restaurant[0]);
          // console.log(secondParam);
          done(null, restaurant[0]);
        }, function(err){
          console.log(err);
          done(err);
        });
      },

      function(restaurant, done){
        console.log(restaurant.id);
        models.Favorite.findOrCreate({ // Add the restaurant to the user's favorites
          where: {
            UserId: req.user.id,
            RestaurantId: restaurant.id
          }
        }).then(function(favorite){
          done(null, favorite);
        }, function(err){
          done(err);
        })
      }

    ], function(err, result){
        if (err) {
          return next(err);
        }
        res.json(result);
      });
    });


// DELETE A FAVORITE
router.route('/favorites/:id')
  .delete(function(req, res) {
    models.Favorite.findById(req.params.id).then(function(favorite) {
      favorite.destroy().then(function() {
        res.json('Your favorite has been deleted.');
      });
    }, function(err) {
      res.sendStatus(500);
    })
  })

module.exports = router;
