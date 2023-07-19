const Product = require('../models/product')
const Order = require('../models/order')
const User = require('../models/user')
const order = require('../models/order')
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const nodemon = require('nodemon');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => { // The default path for use is '/'.
    //res.sendFile(path.join(rootDir,'views','shop.html')) // The path method creates the correct path to our file. 
    // The ../ is added to go up on level, since the __dirname will actually go into the routes folder, but the views folder is located one level up.
    //const products = adminData.products // getting the array of products. 
    // Product.fetchAll((product)=>
    // {
    //     res.render('shop/product-list',{prods:product, Title: 'Products', path: '/products', hasProducts: product.length > 0, activeShop:true, productCSS:true})// The hasProducts will contain a true or false value, depending upon the value of the expression.
    // // Ensures that redenering only happens when all products have been fetched. (Callback)
    // // The activeShop is used for Handlebars and determines the active class.
    // })

    // Using NoSQL

    // Product.findAll().then((products) => {
    //     res.render('shop/product-list',{prods:products, Title:"Products",path:'/products', hasProducts:products.length >0, activeShop: true, productCss:true})
    // }).catch(err => console.log(err))
    let totalItems;
    const page = +req.query.page || 1; //query parameter (+ converts to number), || means if undefined then default value is 1
    Product.find().countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE) //skips the specified number of items, called on a cursor
                .limit(ITEMS_PER_PAGE) // only fetches the reuqired number of items.
                .then((products => {
                    res.render('shop/product-list', {
                        prods: products,
                        Title: "Products",
                        path: '/products',
                        hasProducts: products.length > 0,
                        activeShop: true,
                        productCss: true,
                        currentPage: page,
                        hasPreviousPage: page > 1,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //ceil rounds
                    })
                }))
        })
}
exports.getProduct = (req, res, next) => {
    const productID = req.params.productID //productID is defined in the route, after the colon (In the params Object)
    // Product.findById(productID, product => 
    //     {
    //         res.render('shop/product-detail', {product:product, Title:'Products', path:'/products', activeShop:true})
    //     })

    // Using NOSQL
    // Product.findById(productID).then(([product]) => {
    //     res.render('shop/product-detail', {product:product[0] /* need to pass the first element of the array*/, path:'/products', Title:'Products', activeShop:true})
    // })
    //res.redirect('/'); 

    // Product.findAll({where: {id:productID}}).then(product => {
    //     res.render('shop/product-detail', {product:product[0], path:'/products', Title:product[0].title, activeShop:true})
    // }).catch(err => console.log(err))

    //Another Approach
    // Product.findByPk(productID).then(product => {
    //     res.render('shop/product-detail', {product:product , path:'/products', Title:'Products', activeShop:true})
    // })
    console.log(productID)
    Product.findById(productID) // Works with Mongoose also.
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                path: '/products',
                Title: 'Products',
                activeShop: true,
            })
        })

}
exports.getIndex = (req, res, next) => {
    // Product.fetchAll((product) => {
    //     res.render('shop/index',{prods:product, Title:"My Shop",path:'/', hasProducts:product.length >0, activeShop: true, productCss:true})
    // })

    // Using NoSQL
    // Product.fetchAll().then(products => {
    //     res.render('shop/index',{prods:products, Title:"My Shop",path:'/', hasProducts:products.length >0, activeShop: true, productCss:true})
    // })

    let totalItems;
    const page = +req.query.page || 1; //query parameter (+ converts to number), || means if undefined then default value is 1
    Product.find().countDocuments()
        .then(numberOfProducts => {
            totalItems = numberOfProducts;
            return Product.find() //Using Mongoose
                .skip((page - 1) * ITEMS_PER_PAGE) //skips the specified number of items, called on a cursor
                .limit(ITEMS_PER_PAGE) // only fetches the reuqired number of items.
                .then(products => {
                    //console.log(products);
                    res.render('shop/index', {
                        prods: products,
                        Title: "My Shop",
                        path: '/',
                        currentPage: page,
                        hasPreviousPage: page > 1,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), //ceil rounds
                        hasProducts: products.length > 0,
                        activeShop: true,
                        productCss: true,
                    })
                })
        })


    // Using Sequelize
    // Product.findAll().then(result => {
    //     res.render('shop/index', {prods: result, Title: "My Shop", path:'/', hasProducts:product.length > 0, activeShop:true, productCss:true})
    // })
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productID') //fills the productID's of all products (is an object)
        //.execPopulate()
        .then(user => // the user object is returned here. (full user object)
            {
                console.log(user.cart.items)
                const products = user.cart.items;
                res.render('shop/cart', {
                    path: '/cart',
                    Title: 'Your Cart',
                    activeShop: true,
                    products: products,
                })
            })
        .catch(err => console.log(err))
    // Cart.getCart(cart => {
    //     Product.fetchAll(products =>  {
    //         const cartProducts = []; 
    //         for(let product of products)
    //         {
    //             const cartData = cart.products.find(prod => prod.id === product.id)
    //             if(cartData)
    //             {
    //                cartProducts.push({productData: product, qty: cartData.qty})// appending to array
    //             }
    //         }
    //         res.render('shop/cart', {path: '/cart', Title: 'Your Cart', activeShop: true, products: cartProducts})
    //     })
    // })
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    // Product.findById(productID, (retrievedProduct) => {
    //     Cart.addProduct(productID, retrievedProduct.price)
    // })
    // res.redirect('/cart')
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart()
    // .then(cart =>
    //     {
    //         fetchedCart = cart;
    //         return fetchedCart.getProducts({where: {id:productID}}) // Returns array of products
    //     })
    // .then(retrievedProduct => {
    //     let product;
    //     if(retrievedProduct.length > 0)
    //     {
    //         product = retrievedProduct[0];
    //     }
    //     if(product)
    //     {
    //         const oldQuantity = product.cartItem.quantity //(cartItem in between table)
    //         newQuantity = oldQuantity + 1;
    //         return product;
    //     }
    //     return Product.findByPk(productID)
    // })
    //     .then(product => {
    //         return fetchedCart.addProduct(product,{through: {quantity:newQuantity}}) //Assocation Method (additional field quantity is set)
    //         })
    //     .then(() => res.redirect('/cart'))
    //     .catch(err => console.log(err));
    //console.log(productID)
    Product.findById(productID)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect('/cart')
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    req.user.deleteItemFromCart(productID)
        .then(() => res.redirect('/cart'))
    // Product.findById(productID, retrievedProduct =>
    //     {
    //         Cart.deleteProduct(productID)
    //     })
    // res.redirect('/cart')
}


exports.getOrders = (req, res, next) => {
    Order.find({
            "user.userID": req.user._id
        }) // retrieves all orders for the logged in user.
        .then(orders => {
            //console.log(orders.products.productData)
            res.render('shop/orders', {
                Title: 'Orders',
                shopCSS: true,
                path: '/orders',
                orders: orders,
            })
        })
}

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
        .populate('cart.items.productID')
        .then(user => {
            products = user.cart.items;
            console.log(products);
            total = 0;
            products.forEach(product => {
                total += product.quantity * product.productID.price;
            })

            return stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: products.map(product => {
                        return { //for each product it will be reformatted
                            quantity: product.quantity,
                            price_data: {
                                currency: 'usd',
                                unit_amount: product.productID.price * 100, //cents
                                product_data: {
                                    name: product.productID.title,
                                    description: product.productID.description
                                }
                            }
                        }
                    }),
                    customer_email: req.user.email,
                    success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // http://localhost:3000
                    cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
                })
                .then((session) => {
                    res.render('shop/checkout', {
                        path: '/checkout',
                        Title: 'Checkout',
                        products: products,
                        totalSum: total,
                        stripeSessionID: session.id
                    })
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .then(user => {
            console.log(user.cart.items);
            //user object returned (has cart inside it).
            // Now, in order to match the schema we perform a remapping of the array.
            // We still want the quaniity field and for products we refer to the productID (contains data of all products)
            const products = user.cart.items.map(i => { // i refers to each array element.
                return {
                    quantity: i.quantity,
                    productData: {
                        ...i.productID._doc
                    }
                };
                // Here we create a new JS object and we pull out all the data using the ... operator, _doc is a special field
                // that mongoose gives, to access the data only.
            })
            console.log(products)
            const newOrder = new Order({
                user: {
                    //name: req.user.name,
                    email: req.user.email,
                    userID: req.user
                },
                products: products
            })
            return newOrder.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders')
        }) //chaining promises.
        .catch(err => console.log(err))
}

exports.getInvoice = ((req, res, next) => {
    const orderID = req.params.orderID;
    Order.findById(orderID)
        .then(order => {
            if (!order)
                return next(new Error('No order found!'));
            if (order.user.userID.toString() !== req.user._id.toString()) { // only the user who created the order is allowed to view all orders.
                return next(new Error("Unauthorized!"));
            }
            const invoiceName = 'invoice-' + orderID + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName); //__dirname not required since the current working directory of the process is automatically retrieved.
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf'); //pdf file will open in the browser
            //     res.setHeader('Content-Dispostion', 'inline; filename= "' + invoiceName + '"');
            //     res.send(data);
            // })

            const pdfDoc = new PDFDocument(); //readable stream
            pdfDoc.pipe(fs.createWriteStream(invoicePath)); // creates a new file
            pdfDoc.pipe(res); // passes that data to the response

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('------------------------'); //writing to the file. (A single line)
            let totalPrice = 0;
            order.products.forEach(product => { // products is an array fetched from the db, forEach built-in method
                pdfDoc.fontSize(14).text(product.productData.title +
                    " - " +
                    product.quantity +
                    " x " + " $ " +
                    product.productData.price);
                totalPrice += product.quantity * product.productData.price;
            })
            pdfDoc.text('-----');
            pdfDoc.fontSize(20).text('Total Price: $ ' + totalPrice);
            pdfDoc.end(); //finsihes writing

            // Streaming the file (Best for larger files), otherwise the data will be stored in the memory. [Static Method]
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader('Content-Type', 'application/pdf'); //pdf file will open in the browser
            // res.setHeader('Content-Dispostion', 'inline; filename= "' + invoiceName + '"');
            // file.pipe(res);

        })
        .catch(err => next(err));

})

exports.getCheckoutSuccess = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .then(user => {
            console.log(user.cart.items);
            //user object returned (has cart inside it).
            // Now, in order to match the schema we perform a remapping of the array.
            // We still want the quaniity field and for products we refer to the productID (contains data of all products)
            const products = user.cart.items.map(i => { // i refers to each array element.
                return {
                    quantity: i.quantity,
                    productData: {
                        ...i.productID._doc
                    }
                };
                // Here we create a new JS object and we pull out all the data using the ... operator, _doc is a special field
                // that mongoose gives, to access the data only.
            })
            console.log(products)
            const newOrder = new Order({
                user: {
                    //name: req.user.name,
                    email: req.user.email,
                    userID: req.user
                },
                products: products
            })
            return newOrder.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders')
        }) //chaining promises.
        .catch(err => console.log(err))

}
