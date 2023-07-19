const Sequelize = require('sequelize')

const sequelize = require('../util/SQLdatabase')

const user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    name:{
        type: Sequelize.STRING,
        allowNull : false
    },
    email:
    {
        type : Sequelize.STRING,
        allowNull : false
    }
})
module.exports = user;