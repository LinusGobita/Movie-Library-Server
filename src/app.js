// import the express dependency
const express = require('express');
const mongodb = require("mongodb");
const bodyParser = require("express");

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

/**
 * Setup express middleware
 */
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});


// handle GET request on route '/'
app.get('/', (req, res) => {
    res.send('Hello World!');
});


/**
 * Connect to database
 */
MongoClient.connect(url,function (err, connection) {
    if (err) throw err;
    let db = connection.db(dbName);
    /*
    db.createCollection(collectionName, function (err, res){
        if (err) throw err;
        console.log("collection createt!")
    })

     */
});


/**
 * Insert one Movie
 */
/*
app.post('/movie', (req, res) => {
    console.log(req)
    const movie = req.body;
    collection.insertOne(movie, function(err, result) {
        if (err) throw err;
        res.send({result: 'movie inserted', movie: movie});
    });
});

 */

app.post('/movie', function (req, res){
    console.log("/movie "+req.body)
    MongoClient.connect(url, function (err, connection){
    if (err) throw err;
    let dbo = connection.db(dbName);
    const movie = req.body;
    dbo.collection(collectionName).insertOne(movie, function (err, result){
        if (err) throw err;
        console.log("1 Move add")
        res.send({result: 'movie inserted', movie: movie});
        connection.close();
    })
    })
})

/**
 * get all Movies
 */
app.get('/movies', (req, res) => {
    MongoClient.connect(url, function (err, connection){
        if (err) throw err;
        let dbo = connection.db(dbName);
        dbo.collection(collectionName).find({}).toArray(function (err, result){
            if (err) throw err;
            //console.log(result);
            res.send(result)
            connection.close();
        })
    })
});



/**
 * start server
 */

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
