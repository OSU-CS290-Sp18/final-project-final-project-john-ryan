var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var defaultFeeds = require("./defaultFeeds");

/*var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" +
  mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort +
  "/" + mongoDBName;

var mongoDB = null;*/

let RssFeedEmitter = require('rss-feed-emitter');
let feeder = new RssFeedEmitter();

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.use(express.static('public'));

	var feeds = [];
    var feeditems = [];
    var allitems = [];
    defaultFeeds.forEach(function(feedstring){
        feeder.add({
            url: feedstring.feedURL
        });
    });
    //console.log(feeder.list());
    feeder.on('new-item', function(item){
		allitems.push(item);
    });


app.get('/', function (req, res, next){
    
	console.log(allitems); 
    /*for (feed in defaultFeeds){
        db.urls.updateOne(
            {feedurl: feed},
            {upsert: true}
        );
    }*/
    res.status(200).render('createFeed', {feeds: allitems, home: true});
});

/*app.post(':feedURL', function(req, res, next){});*/

app.get('*', function (req, res) {
    res.status(404).render('404',{home: false, err404: true});
});

/*MongoClient.connect(mongoURL, function(err, client){
    if(err){
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });
});*/
app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });

