const Product = require('../models/product')
const product = require('../models/product');

exports.getProducts = (req, res, next) => { // The default path for use is '/'.
    //res.sendFile(path.join(rootDir,'views','shop.html')) // The path method creates the correct path to our file. 
    // The ../ is added to go up on level, since the __dirname will actuall go into the routes folder, but the views folder is located one level up.
    //const products = adminData.products // getting the array of products. 
    // Product.fetchAll((product)=>
    // {
    //     res.render('shop/product-list',{prods:product, Title: 'Products', path: '/products', hasProducts: product.length > 0, activeShop:true, productCSS:true})// The hasProducts will contain a true or false value, depending upon the value of the expression.
    // // Ensures that redenering only happens when all products have been fetched. (Callback)
    // // The activeShop is used for Handlebars and determines the active class.
    // })

    // Using NoSQL

    Product.findAll().then((products) => {
        res.render('shop/product-list',{prods:products, Title:"Products",path:'/products', hasProducts:products.length >0, activeShop: true, productCss:true})
    }).catch(err => console.log(err))
}
exports.getProduct = (req, res, next) =>
{
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

    Product.findAll({where: {id:productID}}).then(product => {
        res.render('shop/product-detail', {product:product[0], path:'/products', Title:product[0].title, activeShop:true})
    }).catch(err => console.log(err))

    //Another Approach
    // Product.findByPk(productID).then(product => {
    //     res.render('shop/product-detail', {product:product , path:'/products', Title:'Products', activeShop:true})
    // })
}
exports.getIndex = (req, res, next) =>
{
    // Product.fetchAll((product) => {
    //     res.render('shop/index',{prods:product, Title:"My Shop",path:'/', hasProducts:product.length >0, activeShop: true, productCss:true})
    // })

    // Using NoSQL
    // Product.fetchAll().then(([rows, fieldData]) => {
    //     res.render('shop/index',{prods:rows, Title:"My Shop",path:'/', hasProducts:rows.length >0, activeShop: true, productCss:true})
    // })

    // Using Sequelize
    Product.findAll().then(result => {
        res.render('shop/index', {prods: result, Title: "My Shop", path:'/', hasProducts:product.length > 0, activeShop:true, productCss:true})
    })
}

exports.getCart = (req, res, next) =>
{
    req.user.getCart().then(cart => {
        console.log(cart)
        return cart.getProducts() // Association Method (returns the current cart of the user, and the products in it.)
    })
    .then(products =>
        {
            res.render('shop/cart',{path: '/cart', Title: 'Your Cart', activeShop: true, products: products})
        })
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

exports.postCart = (req, res, next) =>
{
    const productID = req.body.productID;
    // Product.findById(productID, (retrievedProduct) => {
    //     Cart.addProduct(productID, retrievedProduct.price)
    // })
    // res.redirect('/cart')
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart =>
        {
            fetchedCart = cart;
            return fetchedCart.getProducts({where: {id:productID}}) // Returns array of products
        })
    .then(retrievedProduct => {
        let product;
        if(retrievedProduct.length > 0)
        {
            product = retrievedProduct[0];
        }
        if(product)
        {
            const oldQuantity = product.cartItem.quantity //(cartItem in between table)
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(productID)
    })
        .then(product => {
            return fetchedCart.addProduct(product,{through: {quantity:newQuantity}}) //Assocation Method (additional field quantity is set)
            })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) =>
{
    const productID = req.body.productID;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where:{id:productID}})
    })
    .then(products => {
        let product = products[0];
        return product.cartItem.destroy() // destroys the product from the inbetween table
    })
    .then(() => res.redirect('/cart'))
    // Product.findById(productID, retrievedProduct =>
    //     {
    //         Cart.deleteProduct(productID)
    //     })
    // res.redirect('/cart')
}
exports.getCheckout =(req, res, next) =>
{
    res.render('shop/checkout',{path: '/checkout', Title:'Checkout'})
}

exports.getOrders = (req, res, next) =>
{
    req.user.getOrders({include: ['products']})// An order is associated with many products (this field has to be passed in order to fetch the corresoping products for an order, (but there has to be aconenction in between them in app.js (Many realtion)))
    .then(orders => {
        console.log(orders)
        res.render('shop/orders', {Title:'Orders', shopCSS:true, path:'/orders', orders:orders})
    })
}

exports.postOrder =(req, res, next)=>
{
    let fetchedCart;
    req.user.getCart()
    .then(cart =>
        {
            fetchedCart = cart;
            return cart.getProducts()
        })
    .then(products => 
        {
            return req.user.createOrder()
            .then(order => {
                order.addProducts(products.map(product => 
                    {
                        product.orderItem = {quantity: product.cartItem.quantity} // gets the quanity for the item in the cart, and puts it in the order.
                        return product;
                }))
        })  
    .then(result => {
        return fetchedCart.setProducts(null)
    })
    .then(() => {res.redirect('/orders')})
    })
    .catch(err => console.log(err))
}