const express = require('express');

const path = require('path');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

//const rootDir = require('../util/path')

// res.sendFile(path.join(__dirname,'../','views','addProduct.html'))

//const adminData = require('./admin')

const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:productID', shopController.getProduct) // Dynamic Route  (: Represents dynmaic route)
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', isAuth, shopController.getCheckout);
// router.post('/create-order', isAuth, shopController.postOrder); (NOT REQUIRED ANYMORE)
router.get('/orders/:orderID', isAuth, shopController.getInvoice);

module.exports = router;