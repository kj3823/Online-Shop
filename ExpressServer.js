//const http = require('http');

const express = require('express')

const app = express();

//const expressHandle = require('express-handlebars')

//app.engine('hbs',expressHandle({layoutsDir: 'views/layout/', defaultLayout: 'main-layout', extname:'hbs'})) // Registers a new templating engine. 
// When we use layouts in HandleBars we have to specify the layout Directory and default layout.
//app.set('view engine', 'hbs') // setting the view engine to handlebars
//app.set('view engine','pug')// telling express.JS that we are using a templating engine.
app.set('view engine', 'ejs');
app.set('views', 'views') // Telling express where to find templates. (In the views folder)

const path = require('path');

const adminRoutes = require('./routes/admin') // import the Router object from the admin file. 

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');

const rootDir = require('./util/path');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

//const db = require('./util/SQLdatabase')

const session = require('express-session')
const multer = require('multer');

const MongoDBStore = require('connect-mongodb-session')(session) //session object passed to the function

const MONGODB_URI = */Your URL */

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => { //callback once we are done
        callback(null, 'images'); //first argument is an error(null if no error), 2nd is the location.
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString() + '-' + file.originalname); //specifiying the file name
    }
}) //storage engine 

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'Sessions'
})

const csrf = require('csurf');
const csrfProtection = csrf(); //Middleware

const flash = require('connect-flash');


// db.execute("SELECT * FROM Products").then(result =>{
//     console.log(result[0])
// })
// .catch(err => {
//     console.log(err);
// })

const mongoConnect = require('./util/database').MongoConnect

//const server = http.createServer(app);


const User = require('./models/user')

app.use(bodyParser.urlencoded({
    extended: false
})) //Parses bodies that are sent through the from. (Then calls next())
//PLACMENT OF THIS CODE IS REALLY IMPORTANT
// THe body parser only handles text data

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype == -'image/jpg' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

app.use(multer({
    dest: 'images' //specifies destination
        ,
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image')) //only a single file, parameter is the field name

app.use(session({
    secret: 'THIS IS A SECRET NO ONE SHOULD KNOW',
    resave: false,
    saveUninitialized: false,
    store: store, //storing the session
    // cookie: {
    //     expires: '10'
    // }
})) // secret used for hashing

//resave is false since for each request we dont need to save unless something has changed
//saveuninitalized is also false, since we don't need to save the session unless something has been changed.

//Incoming requests using the session, SHOULD BE WRITTEN AFTER THE SESSION IS INITIALIZED

app.use(csrfProtection); //CSRF Protection, must be written after the session is initalized, since ot uses sessions.

app.use(flash()); //for error messages.

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
    // The locals field is a special field in ExpressJs, this allows us to set local variables that are passed into the views which are rendered.
})
//CSRF token should be set first.

app.use((req, res, next) => // Incoming request are only uses this middleware(anonoymus function)
    {
        //throw new Error('sfsf'); // will be detected.
        if (req.session.user === undefined) //if user is not loggedIn then next middleware is called.
            return next();
        User.findById(req.session.user._id) //used for every request, data in requests dies after each request, so we manually add this mongoose user object for every incoming request.
            .then(user => {
                //throw new Error('sfsf'); // this won't be detected by our express handling middleware.
                if (!user) {
                    return next(); //extreme case 
                }
                req.user = user;
                next();
            })
            .catch(err => {
                next(new Error(err)); // will be detected
            })
    })


app.use(express.static(path.join(__dirname, 'public'))) // returns a path to the public folder for static files(Ex: styling files.)
app.use('/images', express.static(path.join(__dirname, 'images'))) //statically serves the images folder
// The /images path was added since express assumes that the files in the images folder are served as if they are in the images folder.
// To specify that we need thr images folder the images address is added.
app.use('/admin', adminRoutes.router) // calls the RouterObject, and all routes accessed via /admin
app.use(shopRoutes);
app.use(authRoutes);

const errorController = require('./controllers/error');
const user = require('./models/user');

app.get('/500', errorController.get500Page)
app.use(errorController.get404Page)

app.use((err, req, res, next) => { //error handling middleware, contains 4 params.
    //multiple error handling middlewares are allowed.
    //res.status(err.httpStatusCode).render()
    console.log(err);
    return res.status(500).render('500', {
        Title: 'Error',
        path: '/500',
        isAuthenticated: false,
        formsCSS: true
    });
    res.redirect('/500');
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        //console.log(result);
        // User.findOne() // returns first document
        //     .then(user => {
        //         if (!user) // if user is undefined (no user exists)
        //         {
        //             const newuser = new User({
        //                 name: "Kevin",
        //                 email: "kevin@email.com",
        //                 cart: {
        //                     items: []
        //                 }
        //             })
        //             newuser.save();
        //         }
        //     });
        console.log("Connected to MongoDB");
        app.listen(3000);
    }) // callback being passed, (function to be executed) when the connection is successful.
    .catch(err => console.log(err));
