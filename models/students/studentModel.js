const Sequelize = require('sequelize');
const sequelize = require('../../database/database');

const userSchema =  {
    userID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userFullName: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    userMobile: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
    },
    userEmail: {
      type: Sequelize.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    userPassword: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    userVerified: {
      type: Sequelize.ENUM('Yes', 'No'),
      allowNull: false,
      defaultValue: 'No',
    },
    userOTP: {
      type: Sequelize.STRING(6),
      defaultValue: null,
    },
    countryID: {
      type: Sequelize.SMALLINT,
      allowNull: false,
    },
    stateID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cityID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userSignupOTPVerified: {
      type: Sequelize.ENUM('Yes', 'No'),
      allowNull: false,
      defaultValue: 'No',
    },
}

const User = sequelize.define('users', userSchema,  {
    freezeTableName: true,
    timestamps: false,
    createAt: false,
    paranoid: true,
  }
);

sequelize.sync()
.then(result =>{
    console.log('users table created');
}).catch(err =>{
    console.log(err);
});

module.exports.User = User;
