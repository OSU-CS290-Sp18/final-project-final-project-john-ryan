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

var allitems = [];

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(express.static('public'));

function serveFeeds(docsname){
    return new Promise(function(resolve, reject){
        docsname[0].feedURLs.forEach(function(feedstring){
            feeder.add({
                url: feedstring
            });
        });
        feeder.on('new-item', function(item){
            allitems.push(item);
        });
        resolve();
    });
}

/*app.get("*", function(req,res,next){
    console.log(req.url);
    console.log(req.body);
    console.log(req.statuscode);
    next();
});*/

app.get('/', function (req, res, next){
    allitems = [];
    defaultFeeds.forEach(function(feed){
        feedsDB.updateOne(
            {"pageName":"default"},
            {$addToSet: {"feedURLs": feed.feedURL}},
            {upsert: true}
        );
    });
    feedsDB.find({"pageName": "default"}).toArray(function(err, feedDocs){
        if(err){
            res.status(500).send("Error fetching feeds");
        } else {
            serveFeeds(feedDocs).then(function(){
                setTimeout(function(){
                    res.status(200).render('createFeed', {feeds: allitems, home:true});
                }, 50);
            });
        }
    });
});


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

