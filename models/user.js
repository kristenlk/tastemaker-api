module.exports = function(sequelize, Datatypes){

  var User = sequelize.define('User', {

    id: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    email: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: false //,
      // validate: {
      //   len: {
      //     args: 6
      //   },
      //   is: ['^[a-z]+$','i']
      // }
    }
  }, {
    timestamps: true

  });

  return User;
};
