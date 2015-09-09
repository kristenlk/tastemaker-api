'use strict';

var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.SQL_DB,
  process.env.SQL_USER,
  process.env.SQL_PASS,

  {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'postgres'
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tastemaker');

var models = {};

models.sequelize = sequelize;
models.User = sequelize.import('./user');
models.Favorite = sequelize.import('./favorite');
models.Restaurant = sequelize.import('./restaurant');

models.User.hasMany(models.Favorite, {onDelete: 'cascade', hooks: true});
models.Favorite.belongsTo(models.User);

models.Restaurant.hasMany(models.Favorite, {onDelete: 'cascade', hooks: true});
models.Favorite.belongsTo(models.Restaurant);

module.exports = models;
