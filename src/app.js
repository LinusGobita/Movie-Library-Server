// import the express dependency
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");

// create express app
const app = express();

// define a variable for the port
const port = 3000;

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'movieApp';
const collectionName = 'favourite';
let db = undefined;
let collection = undefined;

//  ############ Start server node src/app.js ############

/**
 * Setup express middleware
 */
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

/**
 * Connect to database
 */
MongoClient.connect(url, function (err, connection) {
    if (err) throw err;
    db = connection.db(dbName);
    collection = db.collection(collectionName);
});


/**
 * Return all favourites Movies
 */
app.get('/movies', (req, res) => {
    collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.send(result)
    });
});

/**
 * Insert one Movie
 */
app.post('/movie', (req, res) => {
    console.log("POT movie with ID " + req.body.id)
    const movie = req.body;
    collection.insertOne(movie, function (err, result) {
        if (err) throw err;
    });
});

/**
 * Delete one Movie by id
 */
app.delete('/dmovie/:id', (req, res) => {
    console.log("DELETE movie with ID " + req.params.id)
    const query = { _id: new mongodb.ObjectID((req.params.id)) };
    collection.deleteOne(query, function (err, obj) {
        if (err) throw err;
    });
})


/**
 * start server
 */
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
