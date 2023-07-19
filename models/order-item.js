const Sequelize = require('sequelize')

const sequelize = require('../util/SQLdatabase')

const orderItem = sequelize.define('orderItem',{
   id:{
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey:true,
       allowNull:false
   },
   quantity: Sequelize.INTEGER
})

module.exports = orderItem;
