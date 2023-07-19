// const Sequelize = require('sequelize')

// const sequelize = require('../util/SQLdatabase')

// const order = sequelize.define('order',{
//    id:{
//        type: Sequelize.INTEGER,
//        autoIncrement: true,
//        primaryKey:true,
//        allowNull:false
//    },
//    quantity: Sequelize.INTEGER
// })

// module.exports = order;

const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: [{ // array of products
        productData: // product informations
        {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        // name: {
        //     type: String,
        //     required: true
        // },
        userID: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
})

orderSchema.methods

module.exports = mongoose.model('Orders', orderSchema);