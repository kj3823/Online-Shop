const express = require('express');

const path = require('path');

const router = express.Router();

//const rootDir = require('../util/path')

// res.sendFile(path.join(__dirname,'../','views','addProduct.html'))

//const adminData = require('./admin')

const shopController = require('../controllers/shop')

router.get('/',shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:productID', shopController.getProduct) // Dynamic Route  (: Represents dynmaic route)
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct)
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);

module.exports = router;