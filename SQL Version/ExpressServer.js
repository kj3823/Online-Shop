//const http = require('http');

const express = require('express')

const app = express();

//const expressHandle = require('express-handlebars')

//app.engine('hbs',expressHandle({layoutsDir: 'views/layout/', defaultLayout: 'main-layout', extname:'hbs'})) // Registers a new templating engine. 
// When we use layouts in HandleBars we have to specify the layout Directory and default layout.
//app.set('view engine', 'hbs') // setting the view engine to handlebars
//app.set('view engine','pug')// telling express.JS that we are using a templating engine.
app.set('view engine', 'ejs');
app.set('views','views')// Telling express where to find templates. (In the views folder)

const path = require('path');

const adminRoutes = require('./routes/admin') // import the Router object from the admin file. 

const shopRoutes = require('./routes/shop');

const rootDir = require('./util/path');

const bodyParser = require('body-parser')

//const db = require('./util/SQLdatabase')

// db.execute("SELECT * FROM Products").then(result =>{
//     console.log(result[0])
// })
// .catch(err => {
//     console.log(err);
// })

//const mongoConnect = require('./util/database').MongoConnect

//const server = http.createServer(app);

// app.use((req, res, next) => {
//     console.log('In the middleware.')
//     next();// Allows the request to go thorugh the next middleware.
// }) // Use creates a new middleware function.
// // next is a function that is executed, that allows the request to travel on to the next middleware.

app.use((req, res, next) => // Incoming request are only uses this middleware(anonoymus function)
{
    User.findByPk(1)// always finds a user.
    .then(user => {
        req.user = user // adding a new field user to the request object.
        next(); // passes the request to the next middleware.
    }).catch(err => {console.log(err)});
});


app.use(express.static(path.join(__dirname,'public')))// returns a path to the public folder for static files(Ex: styling files.)
app.use(bodyParser.urlencoded({extended: false})) //Parses bodies that are sent through the from. (Then calls next())

app.use('/admin',adminRoutes.router) // calls the RouterObject, and all routes accessed via /admin

app.use(shopRoutes);

const controller404 = require('./controllers/404')
app.use(controller404.get404Page)


const sequelize = require('./util/SQLdatabase')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item');
const Order = require('./models/order')
const OrderItem = require('./models/order-item');


// Linking the user and product model
User.belongsTo(Product, {constraints:true, onDelete:'CASCADE'}) // Saying that if we delete a user then everything associated with that user should be deleted.
User.hasMany(Product) // Another Option

User.hasOne(Cart)// A user is allowed only one Cart
Cart.belongsTo(User)// Inverese(Bi-directional)
Cart.belongsToMany(Product, {through: CartItem})// Cart contains many products
Product.belongsToMany(Cart, {through: CartItem})// A product can be added to many carts.
//These relations only works with an intermediate table(that stores a combination of cartID's and productID's.)
// The intermediate table here is the CartItem Model.
Order.belongsTo(User)
User.hasMany(Order, )
Order.belongsToMany(Product, {through:OrderItem})


// app.use((req, res, next) => {
//     User.findByPk(1) // npm start will never execute this (only for incoming requests)
//     .then(user => {
//         req.user = user; // storing the request in a user field. (req.user is a sequelize object)
//         next(); // going to the next middleware.
//     })
//     .catch(err => console.log(err));
// }
// )

sequelize.sync({/*force:true*/}).then(result => // creates relations and tables for the models defined. (force = enforces new changes, don't use in production)
    {
        //console.log(result);
        return User.findByPk(1)
        
    }).then(user =>
        {
            if(!user)
            {
                return User.create({name:'KJ', email:'kj@email.com'}) // Only creates our dummy user, if it doesn't exists
            }
            return user // JS converts theis object into a Promise by using Promise.resolve(user) (Behind The Scenes)
        })
        .then((retrievedUser) =>
        {
            console.log(retrievedUser)
            return retrievedUser.createCart()
        })
        .then(() => 
            {
                app.listen(3000);
            })
    .catch(err => console.log(err));

//server.listen(3000)

//app.listen(3000)
// mongoConnect(() =>
// {
//     app.listen(3000);
// })// callback being passed, (function to be executed) when the connection is successful.