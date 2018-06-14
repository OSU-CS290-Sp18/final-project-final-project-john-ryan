var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
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

var feedreader = require("feedreader");
var request = require("request");

function getFeed(url){
    request(url, function(err, response, xml){
        if(!err && response.statusCode == 200){
            feedreader(xml, function(err, feed){
                if(!err){
                    return feed;
                }
            });
        });
    });
}

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next){
    var defaultFeeds = require(defaultFeeds.json);
    var feeds = [];
    var feeditems = [];
    for (feed in defaultFeeds){
        feeds.push(getFeed(feed));
    }
    for (feed in feeds){
        feeditems.concat(feed.items);
    }
    /*for (feed in defaultFeeds){
        db.urls.updateOne(
            {feedurl: feed},
            {upsert: true}
        );
    }*/
    res.status(200).render('feed-container', {feeds: feeditems});
});

app.post(':feedURL', function(req, res, next){

app.get('*', function (req, res) {
    res.status(404).render('404');
});

MongoClient.connect(mongoURL, function(err, client){
    if(err){
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });
});
