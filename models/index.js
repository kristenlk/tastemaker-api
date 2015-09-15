'use strict';

var Sequelize = require('sequelize');

// var sequelize = new Sequelize(process.env.SQL_DB,
//   process.env.SQL_USER,
//   process.env.SQL_PASS,

//   {
//     host: process.env.SQL_HOST,
//     port: process.env.SQL_PORT,
//     dialect: 'postgres'
// });


if (process.env.DATABASE_URL) {
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  // the application is executed on Heroku ... use the postgres database
  var sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3]
  });

} else {
  var sequelize = new Sequelize(process.env.SQL_DB,
    process.env.SQL_USER,
    process.env.SQL_PASS,

    {
      host: process.env.SQL_HOST,
      port: process.env.SQL_PORT,
      dialect: 'postgres'
    }
  );
};

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
