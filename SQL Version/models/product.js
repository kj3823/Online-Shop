// // const fs = require('fs')
// // const path = require('path')
// // const rootPath = require('../util/path')

// const Cart = require('./cart');

// // const { getDb } = require('../util/database');

// // const getProductsFromFile = (callback) =>
// // {
// //     const finalPath = path.join(rootPath,'data','products.json')
// //     fs.readFile(finalPath, (err, fileContents) =>
// //     {
// //         if(err)
// //         {
// //             //return [];
// //             callback([]);
// //         }
// //     //return JSON.parse(fileContents);
// //     else
// //     {
// //     callback(JSON.parse(fileContents));
// //     }
// //         // Remember that this is asynchronous code, so we need a callback to ensure that the control comes back, once all the products have been fetched.
// //     })

// // }
// // module.exports = class Product {
// // //class Product {
// //     constructor(title)
// //     {
// //         this.title = title; // this.title is a varibale created in the class.
// //         // this.price = price;
// //         // this.description = description;
// //         // this.imageURL = imageURL;
// //     }

// // save()
// // {
// //     const finalPath = path.join(rootPath,'data','products.json')
// //     // products.push(this)// pushes the newly created product into the array.
// //     // console.log(products)
// //     getProductsFromFile(products =>
// //     {
// //         products.push(this)
// //         fs.writeFileSync(finalPath,JSON.stringify(products), (err) =>
// //         {
// //             if(err)
// //             {
// //                 console.log(error)
// //             }        
// //     });
// // });
//     // const finalPath = path.join(rootPath,'data','products.json')
//     // fs.readFile(finalPath, (err, fileContent) =>
//     // {
//     //  let products= [];
//     //     if(!err)// no error occurs
//     //     {
//     //         products = JSON.parse(fileContent)
//     //     }
//     //     products.push(this)
//     //     console.log(err)

//     //     fs.writeFileSync(finalPath,JSON.stringify(products), (err) =>
//     //     {
//     //         if(err)
//     //         {
//     //             console.log(error)
//     //         }
//     //     })
//     // })// reads the file at finalPath
// //}


// // static fetchAll(callback) 
// // {
// //     getProductsFromFile(callback);
// // }
// // save()
// // {
// //     const db = getDb();
// //     db.collection('Products').insertOne(this).then(result =>
        
// //     {
// //         console.log(result);
// //     }).catch(err => //the insertOne method returns a promise.
// //     {
// //         console.log(err)// logs any errors.
// //     }) // (this) - passes the newly created product. (From class product)
// // }


// // const getDb = require('../util/database').getDb;

// // module.exports = class Product {
// //     constructor(id, title, price, description, imageURL)
// //     {
// //         this.id = id;// for a new product null will be passed.
// //         this.title = title;
// //         this.price = parseFloat(price);
// //         this.description = description;
// //         this.imageURL = imageURL
// //     }

// // async save()
// // {
// //     const db = getDb();
// //     if(this.id)
// //     {
// //         const filter = {id: this.id}
// //         const update = {$set:{id:this.id, title:this.title, price: this.price, description:this.description, imageURL:this.imageURL}}
// //         const result = await db.collection('Products').updateOne(filter,update)
// //         console.log(result)
// //     }
// //     else
// //     {
// //     this.id = Math.floor(Math.random() * 10000).toString() // creates a unique id for the newly created product (and then converts it to a string)
// //     db.collection('Products').insertOne(this).then(result =>
// //         {
// //             console.log(result);
// //         }).catch(err =>
// //         {
// //             console.log(err);
// //         })
// //     } 
// // }
// // static fetchAll(callback)
// // {
// //     const db = getDb();
// //     return db.collection('Products').find().toArray().then(result =>
// //         {
// //             //console.log(result);
// //             callback(result) 
// //         }).catch(err =>
// //             {
// //                 console.log(err);
// //             })
// // }

// // static async deleteProduct(productID)
// // {
// //     const db = getDb();
// //     Product.findById(productID, fetchedProduct =>
// //         {
// //             const filter = {id: productID}
// //             const result = db.collection('Products').deleteOne(filter).then(result => {
// //                 console.log(result)
// //                 Cart.deleteProduct(productID)
// //             });
// //         })
// // }

// // static async findById(productID, callback)
// // {
// //     Product.fetchAll((products) => 
// //     {
// //         const requiredProduct = products.find(product => // product is passed, and returns if id == passed id
// //             {
// //                 return product.id === productID
// //             })
// //             callback(requiredProduct) // returns the product found.
// //     })    
// // }
// // }

// const db = require('../util/SQLdatabase')
// module.exports = class Product {
//         constructor(id, title, price, description, imageURL)
//         {
//             this.id = id;// for a new product null will be passed.
//             this.title = title;
//             this.price = parseFloat(price);
//             this.description = description;
//             this.imageURL = imageURL
//         }
//         static fetchAll()
//         {
//             return db.execute("SELECT * FROM Products")
//         }

//         save()
//         {
//             return db.execute("INSERT INTO Products (title, price, description, imageURL) VALUES (?, ?, ?, ?)", [this.title, this.price, this.imageURL, this.description])
//         }

//         static findById(productID)
//         {
//             return db.execute("SELECT * FROM Products WHERE products.id = ?", [productID])
//         }
//     }

// Sequelize Model
const Sequelize = require('sequelize')

const sequelize = require('../util/SQLdatabase')

const product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey : true
  }, 
  title: Sequelize.STRING,
  price:
  {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageURL:
  {
    type: Sequelize.STRING, 
    allowNull: false
  },
  description:
  {
    type: Sequelize.STRING,
    allowNull: false
  }
})
module.exports = product;