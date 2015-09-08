// var express = require('express');
// var router = express.Router();
// var models = require('../models/index');

// // DISPLAY FAVORITES
// router.route('/')
//   .get(function(req, res){
//     res.send({user: req.user});
//   });

// // ADD A FAVORITE
// router.route('/edit')
//   .patch(function(req, res){
//     console.log(req.body);
//     req.user.update({
//       email: req.body.email
//     }).then(function(user){
//       // console.log(user);
//       res.send({user: req.user});
//     }, function(err){
//       res.sendStatus(500);
//     });
//   });

// // DELETE A FAVORITE

// module.exports = router;
