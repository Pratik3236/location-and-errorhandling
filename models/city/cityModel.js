const Sequelize = require('sequelize');
const sequelize = require('../../database/database');

const citySchema = {
    cityID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    countryName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 0
    },
    stateName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 0
    },
    cityName: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}

const City = sequelize.define('city', citySchema, {freezeTableName: true, timestamps: false});

sequelize.sync()
.then(result =>{
    console.log('City table created');
}).catch(err =>{
    console.log(err);
});

module.exports.City = City;