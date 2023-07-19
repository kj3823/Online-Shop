const Sequelize = require('sequelize')

const sequelize = require('../util/SQLdatabase')

const order = sequelize.define('order',{
   id:{
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey:true,
       allowNull:false
   },
   quantity: Sequelize.INTEGER
})

module.exports = order;
