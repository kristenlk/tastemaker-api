'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models/index');

var yelp = require('yelp').createClient({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

// Get highest-rated restaurant that meets user's criteria
router.route('/')
  .get(function(req, res, next) {
    console.log(res.locals.query);
    yelp.search({
      category_filter: res.locals.query.category,
      sort: 2,
      ll: res.locals.query.latitude + ',' + res.locals.query.longitude,
      radius_filter: Number(res.locals.query.distance)
    }, function(err, data) {
      if (err) {
        next(err);
      }
      res.json(data);
    });
  })


// Once I'm returning restaurant price info, I'll need this waterfall
// async.waterfall([
//   function(done) {
    // find all restaurants that meet user's category / are within a certain radius of the user's location
    // order by highest rated
  //   yelp.search({
  //     category_filter: "italian",
  //     sort: 2,
  //     ll:'42.3492724,-71.0502206', /*limit: 1, */
  //     radius_filter: 1000
  //   }).then(function(results) {
  //     done(null, results);
  //   }, function(err) {
  //     done(err);
  //   });
  // },
  // function(results, done) {
  //   // new results array should only be the restaurants that meet the user's price range
  //   var newResults = [];
  //   async.map(results)
  // }


module.exports = router;
