// const mysql = require('mysql2')



// const pool = mysql.createPool({
//     host: "localhost",
//     user: 'root',
//     database: 'Node-Complete',
//     password: 'Alexia2013'
// }) // creates a pool of connections, if we create a single connections it has to be restablished every single time.
// // Once a query finishes executing, using the connection provided by the pool, the connection is returned back to the pool.

// module.exports = pool.promise() //exports it as a promise.


// Using Sequelize

const Sequelize = require('sequelize'); // imports the sequelize class
const sequelize = new Sequelize('Node-Complete', 'root', 'Alexia2013', {dialect: 'mysql', host:'localhost'}) // creates new instance

module.exports = sequelize;