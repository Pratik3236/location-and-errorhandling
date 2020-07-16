const Sequelize = require('sequelize');
const sequelize = require('../../database/database');

const stateSchema = {
    stateID: {
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
        allowNull: false
    }
} 

const State = sequelize.define('state', stateSchema,  {freezeTableName: true, timestamps: false});

sequelize.sync()
.then(result =>{
    console.log('State table created');
}).catch(err =>{
    console.log(err);
});

module.exports.State = State;