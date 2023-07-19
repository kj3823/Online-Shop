const Product = require('../models/product')
const mongodb = require('mongodb')
const {
    validationResult
} = require('express-validator');
const fileHelper = require('../util/file');
exports.getProducts = (req, res, next) => {
    //req.user.getProducts()
    // Product.fetchAll()
    // .then(products => {
    //     res.render('admin/product',{Title:'Admin Products', path: '/admin/admin-products', prods: products, hasProducts : products.length > 0});
    // })
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    console.log(req.user);
    Product.find({
            userID: req.user._id //only fetches products created by that user. (user object avaiable for req, since it is using a middelware) 
        })
        // .select('title price -_id') // only retireves the slected data.
        // .populate('userID') // retireves data from the other relation(user realation)
        .then(products => {
            console.log(products);
            res.render('admin/product', {
                Title: 'Admin Products',
                path: '/admin/admin-products',
                prods: products,
                hasProducts: products.length > 0,
                isAuthenticated: req.session.isLoggedIn
            });
        })
}

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        Title: 'New Product',
        path: '/admin/add-product',
        activeProduct: true,
        productCSS: true,
        formsCSS: true,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
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
    //console.log(req.user)
    const errors = validationResult(req);
    const image = req.file;
    console.log(image);
    if (!image) { //invalid image
        return res.status(422).render('admin/edit-product', {
            Title: 'New Product',
            path: '/admin/add-product',
            activeProduct: true,
            productCSS: true,
            formsCSS: true,
            editing: false,
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description
            },
            hasError: true,
            validationErrors: [],
            errorMessage: "Attached File is not an image"
        })
    }
    const filePath = image.path; //we store the path to the image in the database

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            Title: 'New Product',
            path: '/admin/add-product',
            activeProduct: true,
            productCSS: true,
            formsCSS: true,
            editing: false,
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description
            },
            hasError: true,
            validationErrors: errors.array(),
            errorMessage: errors.array()[0].msg
        });
    } else {
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            imageURL: filePath,
            description: req.body.description,
            userID: req.user._id
        }); // A javascript object is passed to the Product constructor. (Product created based on our model)
        newProduct.save()
            .then(result => {
                res.redirect('/admin/admin-products')
            })
            .catch(err => {
                // return res.status(500).render('admin/edit-product', {
                //     Title: 'New Product',
                //     path: '/admin/add-product',
                //     activeProduct: true,
                //     productCSS: true,
                //     formsCSS: true,
                //     editing: false,
                //     product: {
                //         title: req.body.title,
                //         price: req.body.price,
                //         imageURL: req.body.imageURL,
                //         description: req.body.description
                //     },
                //     hasError: true,
                //     validationErrors: [],
                //     errorMessage: "Database Operation Failed! Please try again."
                // });
                const error = new Error(err);
                error.httpStatusCode = 500; //adding a field to the error object
                return next(error); //passing the error to the error handling middleware.
            })
    }
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
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
    //console.log(productID)
    Product.findById(productID)
        //req.user.getProducts({where: {id:productID}})
        .then(product => {
            if (!product) {
                res.redirect('/')
            }
            res.render('admin/edit-product', {
                Title: 'Edit Product',
                path: '/admin/add-product',
                activeProduct: true,
                productCSS: true,
                formsCSS: true,
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        });

}
exports.postEditProduct = (req, res, next) => {
    const productID = req.body.productID;
    const {
        title,
        price,
        description
    } = req.body;
    const updatedImage = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            Title: 'Edit Product',
            path: '/admin/edit-product',
            activeProduct: true,
            productCSS: true,
            formsCSS: true,
            editing: true,
            product: {
                title: title,
                price: price,
                description: description,
                _id: productID
            },
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const fetchedProduct = Product.findById(productID)
        .then(product => {
            // mogoose object will be fetched here. (will update product if one exists.
            if (product.userID.toString() !== req.user._id.toString()) { //toString() required for comparision
                return res.redirect('/'); //cannot edit that product
            }
            product.title = title;
            product.price = price;
            if (updatedImage) { // a new file was added
                product.imageURL = updatedImage.path;
                fileHelper.deleteFile(product.imageURL); //deletes the previous file
            }
            product.description = description;
            return product.save() //returns the promise
                //updatedProduct.save() // saves the product to the database, (if it doesn't exists, it will create a new one, otherwise overrides it.)
                .then(() => {
                    console.log("Product updated Successfully")
                    res.redirect('/admin/admin-products')
                }) //Handles responses from product.save
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500; //adding a field to the error object
            return next(error); //passing the error to the error handling middleware.
        }); // catches errors from both then blocks.
}
exports.postDeleteProduct = (req, res, next) => { //not used anymore(Sever-side)
    const productID = req.body.productID;
    //Product.deleteProduct(productID);
    //Product.findByIdAndRemove(productID)
    Product.findById(productID).then(product => {
            if (!product) {
                return next(new Error('No product found!'))
            }
            fileHelper.deleteFile(product.imageURL); //deletes the previous file
            return Product.deleteOne({ //delete should only finish after finding is finished.
                _id: productID,
                userID: req.user._id
            }) //checks if the user is allowed to delete products.
        })
        .then(() => {

            console.log("Product Deleted")
            res.redirect('/admin/admin-products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500; //adding a field to the error object
            return next(error); //passing the error to the error handling middleware.
        })
}

exports.deleteProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID)
        .then(product => {
            if (!product) {
                return next(new Error('No product exists!'));
            }
            fileHelper.deleteFile(product.imageURL);
            return Product.deleteOne({
                _id: productID,
                userID: req.user._id
            })
        })
        .then(() => {
            console.log("Deleted Product");
            res.status(200).json({
                message: "Success"
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Deleting product failed!"
            })
        })
}