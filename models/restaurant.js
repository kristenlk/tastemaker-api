'use strict';

module.exports = function(sequelize, Datatypes){

  var Restaurant = sequelize.define('Restaurant', {

    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    yelp_id: {
      type: Datatypes.STRING,
      allowNull: false
    },

    rating: {
      type: Datatypes.FLOAT,
      allowNull: false
    },

    url: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },

    display_address: {
      type: Datatypes.STRING,
      allowNull: false
    },

    display_phone: {
      type: Datatypes.STRING,
      allowNull: true
    },

    latitude: {
      type: Datatypes.STRING,
      allowNull: true
    },

    longitude: {
      type: Datatypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true

  });

  return Restaurant;
};
