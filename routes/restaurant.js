'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var async = require('async');

// html parsing
var Parser = require('jq-html-parser');
var request = require('request');

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

// Get highest-rated restaurant that meets user's criteria
router.route('/')
// Not querying restaurants table - that's only so I don't have to query Yelp API every time a user wants to see their favorites
  .get(function(req, res, next) {

    async.waterfall([
      function(done) {
        // grab all restaurants that meet user's criteria
        yelp.search({
          category_filter: res.locals.query.category_filter,
          sort: 2,
          ll: res.locals.query.ll,
          radius_filter: res.locals.query.radius_filter,
          term: 'food'
        }, function(err, results) {
          done(null, results);
        }, function(err) {
          done(err);
        });
      },
      function(results, done) {
        // parse through each restaurant, grab url, go to url and parse html, grab $$$, append it as a new key to each restaurant
        async.map(results.businesses, function(business, callback){
          var config = {
            price: {
              selector: '.price-range'
            }
          };

          var url = business.url;

          request.get(url, function(err, res, body){
            // if (err || (res.statusCode != 200)){
            //   return console.log('An error occurred while retrieving restaurant information.');
            // }

            var parser = new Parser(config);
            var result = parser.parse(body);
            business.price = result.price;
            callback(null, business)
          });

        }, function(err, results){
          done(null, results);
        }, done);


      },
      function(results, done){
        var filteredResults = [];
        var filteredResults = results.filter(function(business){
          return business.price <= res.locals.query.price;
        });
        done(null, filteredResults);
      }

      ], function(err, results){
        if (err) {
          return next(err);
        }
        res.json(results);
      });
    });

  module.exports = router;
