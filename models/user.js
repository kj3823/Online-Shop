// const getdB = require('../util/database').getDb
// const mongodb = require('mongodb')

// class User {
//     constructor(name, email, id, cart)
//     {
//         this._id = id
//         this.name = name
//         this.email = email
//         this.cart = cart // cart associated with user (items:{})
//     }

//     save()
//     {
//         const db = getdB()
//         if(this._id)
//         {
//           return db.collection('Users').updateOne({_id: this._id}, {$set: this})  
//         }
//         else
//         {
//             return db.collection('Products').insertOne(this)
//         }
//     }

//     addToCart(product)
//     {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString() // need to convert the objectId to String, for comparision.
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items]
//         if(cartProductIndex > -1)
//         {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQuantity
//         }
//         else
//         {
//             updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity}) //  adding a field
//         }
//         //product.quantity = 1; //adding a field on the fly in JS.
//         //const updatedCart = {items:[product]}
//         const updatedCart = {items:updatedCartItems} 
//         const db = getdB()
//         return db.collection('Users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{ cart:updatedCart}}) 
//     }

//     getCart() 
//     {
//         const db = getdB();
//         const productIDs = this.cart.items.map(item => {
//             return item.productId; //returns an array of product IDs.
//         })
//         return db.collection('Products').find({_id:{$in:productIDs}}).toArray()
//         .then(products => {
//             return products.map(product => {
//                 return {...product, quantity:this.cart.items.find(item => {
//                     return item.productId.toString() === product._id.toString();
//                 }).quantity
//                 }
//             })
//         })
//     }

//     deleteItemFromCart(productID)
//     {
//         const updatedCartItems = this.cart.items.filter(item => { // defines a criteria to filter an array returns a new array
//             return item.productId.toString() !== productID.toString(); // returns false (for item to remove) (Only items that we want are returned)
//         })
//         const updatedCart = {items:updatedCartItems} 
//         const db = getdB()
//         return db.collection('Users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{ cart:updatedCart}}) 
//     }

//     addOrder()
//     {
//         const db = getdB();
//         return this.getCart().then(products => { // retrieves product information from the cart
//             const order = {
//                 items: products, 
//                 user:{
//                     _id:new mongodb.ObjectId(this._id),
//                     name:this.name,
//                     email:this.email
//                 }
//             }
//                 return db.collection('Orders').insertOne(order)
//         })
//         .then(result => {
//                     this.cart = {items: []};
//                     const updatedCart = {items:[]} 
//                     return db.collection('Users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{ cart:updatedCart}}) 
//         })
//     }

//     getOrders()
//     {
//         const db = getdB();
//         return db.collection('Orders').find({"user._id": new mongodb.ObjectId(this._id)}).toArray();
//     }

//     static findByID(userID)
//     {
//         const db = getdB()
//         return db.collection('Users').find({_id : new mongodb.ObjectId(userID)}).next()
//         .then(user =>{console.log(user)
//         return user})
//         .catch(err => console.log(err))
//     }
// }
// module.exports = User;

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true,
    // },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{ // Array of embedded documents
            quantity: {
                type: Number,
                required: true
            },
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            }
        }]
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiryDate: {
        type: Date,
        required: false
    }
})

userSchema.methods.addToCart = function (product) { //creating our own function
    const cartProductIndex = this.cart.items.findIndex(cp => { //this.cart refers to the users cart.
        //returns the products in the cart, returns the index of the item being passed.(if present in the cart else returns -1)
        return cp.productID.toString() === product._id.toString() // need to convert the objectId to String, for comparision.
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items] //copying cart

    if (cartProductIndex > -1) //product already exists
    {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else //adding the product
    {
        updatedCartItems.push({
            productID: product._id,
            quantity: newQuantity
        }) //  adding a field
    }
    //product.quantity = 1; //adding a field on the fly in JS.
    //const updatedCart = {items:[product]}
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save(); //saves the cart to the database
}

userSchema.methods.deleteItemFromCart = function (productID) {
    const updatedCartItems = this.cart.items.filter(item => { // defines a criteria to filter an array returns a new array
        return item.productID.toString() !== productID.toString(); // returns false (for item to remove) (Only items that we want are returned)
    })
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    } //clearing the cart
    return this.save();
}

module.exports = mongoose.model('User', userSchema);