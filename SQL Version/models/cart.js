// const fs = require('fs');
// const path = require('path')
// //const constructedPath = path.join(require.main.filename,'data', 'cart.json')
// const constructedPath = path.join(path.dirname(process.mainModule.filename),'/data', '/cart.json')
// // There will be an error here, if you create the cart.json file, and use process.mainModule (depricated), the code will not work.
// // The new file construction method require.main.filename will not create the cart.JSON file.
// module.exports = class Cart {
    
//     static addProduct(productID, productPrice)
//     {
//         // fetch the previous cart
//         fs.readFile(constructedPath, (err, fileContents) => {
//             let cart = {products: [], totalPrice: 0}
//             if(!err)
//             {
//                 cart = JSON.parse(fileContents)
//             }
//             const existingProductIndex = cart.products.findIndex(product => product.id === productID // returns the product with the matching id, (product) is our callback 
//             );
//             const existingProduct = cart.products[existingProductIndex]
//             let updatedProduct;
//             // analyze the cart to see if the product is already present or not.
//             if(existingProduct)
//             {
//                 updatedProduct = {...existingProduct}// transferring properties of existingProduct (Spread Operator)
//                 updatedProduct.qty += 1;
//                 cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct;
//             }
//             else
//             {
//                 updatedProduct = {id:productID, qty:1}
//                 cart.products = [...cart.products, updatedProduct] // creates a new array with the existing products, and the new one
//             }
//              // Then adjust the proce accordingly.
//             cart.totalPrice +=  + productPrice; //(The + converts the string to an number)
//             fs.writeFile(constructedPath, JSON.stringify(cart), (err) =>
//             {
//                 console.log(err);
//             });
//         });
//     }

// static deleteProduct(productID)
// {
//     fs.readFile(constructedPath, (err, fileContents) => {
//         if(err)
//         {
//             console.log(err)
//             return; // no cart present
//         }
//         const updatedCart = {...JSON.parse(fileContents)}
//         const product = updatedCart.products.find(product => product.id === productID)
//         if(!product)
//         {
//             return;// no product in cart
//         }
//         updatedCart.products = updatedCart.products.filter(prods => prods.id!== productID)// keeps all other products except the one matching the passed productId
//         updatedCart.totalPrice -= product.price * product.qty
//         fs.writeFile(constructedPath, JSON.stringify(updatedCart), (err)=>{
//         console.log(err)
//          })
// })
// }

// static getCart(callback)
// {
//     fs.readFile(constructedPath, (err, fileContents) => {
//         if(!err)
//         {
//             return callback(JSON.parse(fileContents)) // returns the whole cart
//         }   
//         callback(null)// if no cart is present
//     })
// }
// }

 const Sequelize = require('sequelize')

 const sequelize = require('../util/SQLdatabase')

 const Cart = sequelize.define('cart',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true,
        allowNull:false
    }
 })

module.exports = Cart;

