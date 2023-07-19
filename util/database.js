const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient
let _db;
const MongoConnect = (callback) => 
{
    MongoClient.connect('mongodb+srv://jjink3823:5lZcBVolSZRMiGv2@cluster0.s0o5toi.mongodb.net/shop?authMechanism=SCRAM-SHA-1')
        .then((clientObject) => {
            console.log("Connected to Cluster")
            _db = clientObject.db()
            callback(clientObject);
        })
        .catch(err => {
            throw err;
            console.log(err)
        })
}
const getDb = () =>
{
    if(_db)
    {
        return _db;
    }
    throw "No Database found"
}

// A callback is an function passed as an argument to another function.
// Here the MongoConnect function executes, and when the then() method is called, it executes a callback.
// executing before the then function is called.

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;