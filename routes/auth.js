const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user')

const {
    check,
    body
} = require('express-validator'); // check is a subpackage
//Destructuring, pulls out certin values from JS ovbject.


router.get('/login', authController.getLogin);
router.post('/login',
    [
        body('email')
        .isEmail()
        .normalizeEmail() //built in sanatizer
        .withMessage('Please Enter a Valid Email'),
        body('password', 'Password has to be valid')
        .isLength({
            min: 5,
            max: 12
        })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please Enter a Valid Email')
        .custom((value, { // a custom validator
            req // req object also present incase data needs to be extracted out of it.
        }) => {
            // if (value == 'test@test.com') { // value refers to email field value
            //     throw new Error("This email is not allowed.")
            // }
            // return true;
            return User.findOne({ //checks if the user exists (Async validation)
                    email: value
                })
                .then(userDocument => {
                    if (userDocument) { //User already exists
                        return Promise.reject("Email already exists, please pick another email") // rejects a promise.
                    }
                });
        }),
        body('password', 'Please enter a password with letters and numbers and at least 5 characters long') //checks for password in the body only.
        .isLength({
            min: 5,
            max: 12
        }) // setting min and max length
        .isAlphanumeric()
        .trim(),
        body('confirm')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ],
    authController.postSignup); //check() is a middleware
// The parameter in check specifies which field in the POST request to check (checks all cookies and values). Then is Email() is used,
// With Meassge refers to the check right before it.
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword); //dynamic route
router.post('/new-password', authController.postNewPassword);

module.exports = router;