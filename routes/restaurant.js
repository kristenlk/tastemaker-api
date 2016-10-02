'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var async = require('async');

// html parsing
var Parser = require('jq-html-parser');
var request = require('request');

var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: process.env.CONSUMER_KEY,
  app_secret: process.env.CONSUMER_SECRET
});

// Get highest-rated restaurant that meets user's criteria
router.route('/')
  .get(function(req, res, next) {
    async.waterfall([
      function(done) {
        var priceArray = [];

        for (var i = 1; i <= 4; i++) {
           priceArray.push(i);
        }

        yelp.search({
          categories: res.locals.query.categories,
          sort: 2,
          latitude: res.locals.query.latitude,
          longitude: res.locals.query.longitude,
          radius: res.locals.query.radius,
          price: priceArray.join(","),
          term: 'food'
        }, function(err, results) {
          done(null, results);
        }, function(err) {
          done(err);
        });
      },

    ], function(err, results){
      if (err) {
        return next(err);
      }
      res.json(results);
    });
  });

module.exports = router;
