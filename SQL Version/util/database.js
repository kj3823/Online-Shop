const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = (myCallback) =>
{
MongoClient.connect('mongodb+srv://jjink3823:5lZcBVolSZRMiGv2@cluster0.s0o5toi.mongodb.net/shop?authMechanism=SCRAM-SHA-1').then(client => {
    console.log('Connection Successful!')
    _db = client.db()// stores access to the database.(Can also specify the name of database as a parameter.)
myCallback(client)
}).catch(err => {
    console.log(err)// The connect method returns a promise, which we can catch and print (for error conditions)
    throw err; 
}) 
}

// A callback is an function passed as an argument to another function.
// Here the MongoConnect function executes, and when the then() method is called, it executes a callback.
// executing before the then function is called.

const getDb = (() => {
    if(_db) // undefined (not been set)
    {
        return _db; // returns access to the database.
    }
    throw 'No database found'
})

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;