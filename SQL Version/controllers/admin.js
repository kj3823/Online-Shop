const Product = require('../models/product')
exports.getProducts = (req, res, next) =>
{
    req.user.getProducts()
    //Product.findAll()
    .then(products => {
        res.render('admin/product',{Title:'Admin Products', path: '/admin/admin-products', prods: products, hasProducts : products.length > 0});
    })
}

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product',{Title:'New Product', path: '/admin/add-product', activeProduct:true, productCSS:true, formsCSS:true, editing: false});
}

exports.postAddProduct = (req, res, next) => {
    //console.log(req.body);
    //products.push({title: req.body.title}) // Creates an object, and pushes the title only inside.
//     const product = new Product(null, req.body.title, req.body.price, req.body.description, req.body.imageURL)
//     product.save().then(() => { // saves the product
//         res.redirect('/')// Once insertion is complete, we should redirect.
//     }).catch(err => {console.log(err);})
// }
// Using Sequelize:
// Since we added a link between user and Product we can create a product like this.
Product.create({title: req.body.title, price: req.body.price, imageURL: req.body.imageURL, description: req.body.description, userId:req.user.id }).then(result => {
    console.log(result)
    res.redirect('/admin/admin-products')
}).catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => 
{
    const editMode = req.query.edit
    if(!editMode)
    {
    res.redirect('/');
    }
    const productID = req.params.productID;
    // Product.findById(productID, retrievedProducts =>
    // {
    //     if(!retrievedProducts)
    //     {
    //         res.redirect('/')
    //     }
    // res.render('admin/edit-product',
    // {
    //     Title:'Edit Product', 
    //     path: '/admin/edit-product', 
    //     activeProduct:true,
    //     productCSS:true, 
    //     formsCSS:true, 
    //     editing: editMode,
    //     product : retrievedProducts
    // });
    // });

    //Product.findByPk(productID)
    req.user.getProducts({where: {id:productID}})
    .then(products =>
    {
        if(!products)
        {
            res.redirect('/')
        }
    res.render('admin/edit-product',
    {
        Title:'Edit Product', 
        path: '/admin/edit-product', 
        activeProduct:true,
        productCSS:true, 
        formsCSS:true, 
        editing: editMode,
        product : products[0]
    });
    });

}
exports.postEditProduct = (req, res, next) =>
{
    const productID = req.body.productID;
    const {title, price, imageURL, description } = req.body;
    Product.findByPk(productID)
    .then(product => {
        product.title = title;
        product.price = price;
        product.imageURL = imageURL;
        product.description = description;

        return product.save() // saves the product to the database, (if it doesn't exists,m it will create a new one, otherwise overrides it.)
    })
    .then(() =>{ 
        console.log("Product updated Successfully")
        res.redirect('/admin/admin-products')
    }) //Handles responses from product.save
    .catch(err => console.log(err)); // catches errors from both then blocks.
}
exports.postDeleteProduct = (req, res, next)=>
{
    const productID = req.body.productID;
    //Product.deleteProduct(productID);
    Product.findByPk(productID).then(product =>
        {
           return product.destroy()
        })
        .then(() => {
            console.log("Destroyed Product")
            res.redirect('/admin/admin-products')
        })
}