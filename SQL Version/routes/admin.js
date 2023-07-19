const express = require('express');
const path = require('path');

//const rootDir = require('../util/path');

const adminController = require('../controllers/admin')

const router = express.Router()

// reached via /admin/add-product
router.get('/add-product', adminController.getAddProduct// The default path for use is '/'. 
    //(The post method is same as use, but will only fire for POST request, there is also one for GET, get() method)
    //res.sendFile(path.join(__dirname,'../','views','addProduct.html'))
    //res.sendFile(path.join(rootDir,'views','add-product.html'))
    )
// reached via /admin/products
router.post('/add-product',adminController.postAddProduct)

router.get('/admin-products', adminController.getProducts)

router.get('/edit-product/:productID', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)

router.post('/delete-product', adminController.postDeleteProduct)
exports.router = router;
//exports.products = products;