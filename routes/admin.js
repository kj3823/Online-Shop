const express = require('express');
const path = require('path');

//const rootDir = require('../util/path');

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/isAuth')

const {
    check,
    body
} = require('express-validator');

const router = express.Router()

// reached via /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct) // The default path for use is '/'. 
//(The post method is same as use, but will only fire for POST request, there is also one for GET, get() method)
//res.sendFile(path.join(__dirname,'../','views','addProduct.html'))
//res.sendFile(path.join(rootDir,'views','add-product.html'))

// reached via /admin/products
router.post('/add-product',
    [
        body('title')
        .isAlphanumeric()
        .isLength({
            min: 3,
        })
        .trim(),
        body('price')
        .isFloat(),
        body('imageURL'),
        body('description')
        .isLength({
            min: 3,
            max: 400
        })
        .trim()
    ],
    isAuth, adminController.postAddProduct) //any number of middlewares can be added. Parsed from left -> right

router.get('/admin-products', isAuth, adminController.getProducts)

router.get('/edit-product/:productID', isAuth, adminController.getEditProduct)

router.post('/edit-product',
    [
        body('title')
        .trim()
        .isString()
        .isLength({
            min: 3,
        })
        .trim(),
        body('price')
        .trim()
        .isFloat(),
        body('imageURL')
        .trim(),
        body('description')
        .isLength({
            min: 3,
            max: 400
        })
        .trim()
    ], isAuth, adminController.postEditProduct)

// router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.delete('/product/:productID', isAuth, adminController.deleteProduct);

exports.router = router;
//exports.products = products;