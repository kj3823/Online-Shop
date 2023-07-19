const User = require("../models/user")
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
//const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const user = require("../models/user");
const {
    validationResult
} = require('express-validator')

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_user: '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'
//     }
// }));

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
        user: 'kevinjoseph3823@yahoo.com',
        pass: 'whrahhpwmgybagsy',
        debug: false,
        logger: true
    }
})

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie') // retireves all cookies
    // .trim()
    // .split('=')[1] === 'true'; // data always sent as string
    //console.log(req.session) //printing the session object
    //console.log(req.session.isLoggedIn)
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0]; //retrieves message;
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        Title: 'Login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true; //data is lost after response is sent
    //res.setHeader('Set-Cookie', "loggedIn = true; HttpOnly") //Set-Cookie reserved name, key value pair
    // User.findById('637a4fabcd57316dfa9dd705')
    //     .then(user => {
    //         req.session.user = user; //sets the user information,(mongoose object)
    //         req.session.isLoggedIn = true;
    //         req.session.save(err => { // The save method is used to ensure that the session is written to the database before the next action is fired.
    //             if (err)
    //                 console.log(err);
    //             res.redirect('/');
    //         })
    //  })
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                Title: 'Login',
                isAuthenticated: false,
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            })
    }
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) { //no user exists with that email.
                return res.status(422)
                    .render('auth/login', {
                        path: '/login',
                        Title: 'Login',
                        isAuthenticated: false,
                        errorMessage: "Invalid Email or Password",
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: [] //[{
                        //     param: 'email',
                        //     param: 'password'
                        // }] (Not giving away what went wrong)
                    })
            }
            bcrypt.compare(password, user.password) //compares the password that the user entered with the one in the user document. (returns true of false)
                .then(result => {
                    if (result) {
                        req.session.user = user; //sets the user information,(mongoose object)
                        req.session.isLoggedIn = true;
                        return req.session.save(err => { // The save method is used to ensure that the session is written to the database before the next action is fired.
                            if (err)
                                console.log(err);
                            res.redirect('/');
                        })
                    }
                    req.flash("error", "Invalid Email or Password")
                    return res.redirect('/login') // user enters incorrect password.
                })
                .catch(err => res.redirect('/login')); //only executes if an error occurs
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    }); //used to destroy the session cookie
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0]; //retrieves message;
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        Title: 'Signup',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password;
    const errors = validationResult(req); // errors are stored here
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422) //validation failed.
            .render('auth/signup', {
                path: '/signup',
                Title: 'Signup',
                isAuthenticated: false,
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: req.body.email,
                    password: req.body.password,
                    confirmPassword: req.body.confirm
                },
                validationErrors: errors.array()
            }); //renders the same page.
    }
    bcrypt.hash(password, 12) //first parameter is string, and second is salt value (how many rounds of hashing)
        .then(hashedPassword => {
            const newUser = new User({
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            });
            return newUser.save();
        })
        .then(() => {
            res.redirect('/login')
            return transporter.sendMail({ // we return here to catch any errors.
                to: email,
                from: 'kevinjoseph3823@yahoo.com',
                subject: 'Signup Succeeded!',
                html: "<h1>You successfully signed up!</h1>"
            })
        })
        .then(result => console.log(result))
        .catch(err => console.log(err))
}

exports.getReset = ((req, res, next) => {
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0]; //retrieves message;
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        Title: 'Reset Password',
        errorMessage: message
    })
})

exports.postReset = ((req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => { //number of bytes, callback is second argument (function to be exceuted)
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString("hex") // coverts hex to ASCII (additional information passed)
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No Account with that email found')
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiryDate = Date.now() + 3600000 //(Plus 1 hr in ms); Date.now gives current date and time
                return user.save()
                    .then(() => {
                        res.redirect('/');
                        transporter.sendMail({
                            to: req.body.email,
                            from: 'kevinjoseph3823@yahoo.com',
                            subject: 'Password Reset',
                            html: `<p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>`
                            // uses `` a next-gen feature to write multiple lines, ${} injects values into the URL.
                        })
                    })
            })
            .catch(err => console.log(err))
    })
})

exports.getNewPassword = ((req, res, next) => {
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpiryDate: {
                $gt: Date.now()
            }
        }) //token expiration should be greater than current date and time
        .then(user => {
            res.render('auth/updatePassword', {
                path: '/new-password',
                Title: 'Reset Password',
                errorMessage: message,
                passwordToken: token, //extracted from URL
                userID: user._id.toString()
            })
        })
    let message = req.flash('error');
    console.log(message);
    if (message.length > 0) {
        message = message[0]; //retrieves message;
    } else {
        message = null;
    }

})

exports.postNewPassword = ((req, res, next) => {
    const newPassword = req.body.password;
    const userID = req.body.userID;
    const passwordToken = req.body.passwordToken; //for security
    let resetUser;

    User.findOne({
            resertToken: passwordToken,
            resetTokenExpiryDate: {
                $gt: Date.now()
            },
            _id: userID
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiryDate = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err))
})