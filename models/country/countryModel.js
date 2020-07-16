const Sequelize = require('sequelize');
const sequelize = require('../../database/database');

const countrySchema = {
    countryID: {
        type: Sequelize.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    countryName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    countryDialCode: {
        type: Sequelize.STRING(5)
    }
}

const Country = sequelize.define('country', countrySchema, {freezeTableName: true, timestamps: false});

sequelize.sync()
.then(result =>{
    console.log('Country table created');
}).catch(err =>{
    console.log(err);
});

module.exports.Country = Country;