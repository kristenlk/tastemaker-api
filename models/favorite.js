'use strict';

module.exports = function(sequelize, Datatypes){

  var Favorite = sequelize.define('Favorite', {

    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }

  }, {
    timestamps: true

  });

  return Favorite;
};
