var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var defaultFeeds = require("./defaultFeeds");
var multer = require('multer');
var upload = multer();

var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu";//process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = "cs290_woodr";//process.env.MONGO_USERNAME;
var mongoPassword = "Wmr112694!";//process.env.MONGO_PASSWORD;
var mongoDBName = "cs290_woodr";//process.env.MONGO_DB_NAME;

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
var sourceList  = [];

defaultFeeds.forEach(function(feed){
	sourceList.push(feed.feedURL);
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(express.static('public'));

function serveFeeds(docsname){
    allitems = [];
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


app.post('/', function(req, res){
	console.log(req.body);
	sourceList = req.body.follow;
	feedsDB.updateOne(
		{"pageName":"feedList"},
		{$set: {"feedURLs": []}}
	);
	res.status(200).redirect('back');	    	
});


app.get('/', function (req, res, next){
    console.log(sourceList);
    sourceList.forEach(function(feed){
        feedsDB.updateOne(
            {"pageName":"feedList"},
            {$addToSet: {"feedURLs": feed}},
            {upsert: true}
        );
    });
    feedsDB.find({"pageName": "feedList"}).toArray(function(err, feedDocs){
        if(err){
            res.status(500).send("Error fetching feeds");
        } else {
            serveFeeds(feedDocs).then(function(){
                setTimeout(function(){
                    res.status(200).render('createFeed', {feeds: allitems, source: defaultFeeds});
                }, 100);
            });
        }
    });
});




/*app.post(':feedURL', function(req, res, next){});*/

app.get('*', function (req, res) {
    res.status(404).render('404');
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

