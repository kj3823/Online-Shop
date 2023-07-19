// const getDb = require('../util/database').getDb; // returns database connection instance
// const mongodb = require('mongodb')
// class Product {
//   constructor(title, price, description, imageURL, id, userId)
//   {
//     this._id = id // when we create a new product _id will be undefined and will be created by mongodb. (else we can use it to update a product)
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageURL = imageURL;
//     this.userId = userId;
//   }
//   save()
//   {
//     const db = getDb();
//     if(this._id)
//     {
//       return db.collection('Products').updateOne({_id: this._id}, {$set:this}) // replaces all fields. (_id will always be ObjectId)
//     }
//     else
//     {
//       return db.collection('Products').insertOne(this)// save the current product instance
//       .then(result => console.log(result))
//       .catch(err => console.lof(err))
//     }
//   }
//   static deleteById(productID)
//   {
//     const db = getDb();
//     return db.collection('Products').deleteOne({_id: new mongodb.ObjectId(productID)}).then((result) =>{console.log(result)})
//   }

//   static findByID(productID)
//   {
//     const db = getDb();
//     return db.collection('Products').find({_id:new mongodb.ObjectId(productID)}).next() // next is called, to get the next document or last one in this case.
//     // we are commpaing the _id field in mondogd, which is actually an object, so we create an ew object of type _id for comparision
//   }

//   static fetchAll()
//   {
//     const db = getDb();
//     return db.collection('Products').find().toArray()// find returns a cursor not a promise. (It points to a document) (to Array then converts it to an array, should only be used with small number of itwems)
//     .then(products => {
//       //console.log(products)
//       return products;
//     })
//   }
//  }

// module.exports = Product

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    require: true
  },
  description: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // creating relations between models
    required: true
  }

})
module.exports = mongoose.model('Products', productSchema); //exporting the model schema
// Mongoose creates the database by converting it to lowerletters.