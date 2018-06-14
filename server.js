var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var defaultFeeds = require("./defaultFeeds");

var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" +
  mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort +
  "/" + mongoDBName;

var mongoDB = null;
var feedsDB;

let RssFeedEmitter = require('rss-feed-emitter');
var feeder = new RssFeedEmitter();

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(express.static('public'));

/*var allitems = [];
defaultFeeds.forEach(function(feedstring){
    feeder.add({
        url: feedstring.feedURL
    });
});*/
var allitems = [];

app.use(function(req,res,next){
    feedsDB.updateOne(
        {"pageName":"default"},
        {$set: {"feedURLs": []}},
        {upsert: true}
        );
    for (feed in defaultFeeds){
        feedsDB.updateOne(
            {"pageName": "default"},
            {$addToSet: {"feedURLs": defaultFeeds[feed].feedURL}},
            {upsert: true}
        );
    }
    next();
});



app.get('/', function (req, res, next){
    feedsDB.find({"pageName": "default"}).toArray(function(err, feedDocs){
        if(err){
            res.status(500).send("Error fetching feeds from DB.");
        } else {
            feedDocs[0].feedURLs.forEach(function(feedstring){
                //console.log(feedstring);
                feeder.add({
                    url: feedstring
                });
            });
            feeder.on('new-item', function(item){
                //console.log(item);
                allitems.push(item);
            });
            console.log(allitems);
            res.status(200).render('createFeed', {feeds: allitems, home: true});
        }
    });
    next();
});

/*app.post(':feedURL', function(req, res, next){});*/

app.get('*', function (req, res) {
    res.status(404).render('404',{home: false, err404: true});
});

MongoClient.connect(mongoURL, function(err, client){
    if(err){
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    feedsDB = mongoDB.collection("feeds");
    app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });
});
/*app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });*/

