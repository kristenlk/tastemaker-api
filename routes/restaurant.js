'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var async = require('async');

// html parsing
var Parser = require('jq-html-parser');
var request = require('request');

var yelp = require('yelp').createClient({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

// Get highest-rated restaurant that meets user's criteria
router.route('/')
// Not querying restaurants table - that's only so I don't have to query Yelp API every time a user wants to see their favorites
  .get(function(req, res, next) {
  //   yelp.search({
  //     category_filter: "italian",
  //     sort: 2,
  //     ll:'42.3492724,-71.0502206', // limit: 1,
  //     radius_filter: 1000
  //   }, function(err, data) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.json(data.businesses);
  //   });

    // change where request is coming from
    // with the data I get back, go to each business's URL (restaurant.url or whatever)
    // https://www.npmjs.com/package/jq-html-parser
  // })

  // .get(function(req, res, next) {
  //   console.log(res.locals.query);
  //   yelp.search({
  //     category_filter: res.locals.query.category_filter,
  //     sort: 2,
  //     ll: res.locals.query.ll,
  //     radius_filter: res.locals.query.radius_filter,
  //     term: 'food'
  //   }, function(err, data) {
  //     console.log(err);
  //     if (err) {
  //       return next(err);
  //     }
  //     res.json(data);
  //   });
  // })


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
      console.log('All Yelp results, prior to parsing:');
      console.log(results);
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
        console.log('parser:');
        console.log(parser);
        var result = parser.parse(body);
        console.log('result:');
        console.log(result.price);
        business.price = result.price;
        callback(null, business)
      });

    }, function(err, results){
      console.log('After parsing:');
      console.log(results);
      done(null, results);
    }, done);


  },
  function(results, done){
    var filteredResults = [];
    var filteredResults = results.filter(function(business){
      // return business.price === '$$';
      // console.log(res.locals.query);
      return business.price <= res.locals.query.price;
    });
    console.log('res.locals.query.price:');
    console.log(res.locals.query.price);
    done(null, filteredResults);
    console.log("filteredResults: ")
    console.log(filteredResults);
  }

  ], function(err, results){
    if (err) {
      return next(err);
    }
    console.log('results');
    console.log(results);
    res.json(results);

    // go through all restaurants, new array contains only the restaurants that meet the user's price range


    // return all restaurants that meet user's price range
    //
  });

});

module.exports = router;
