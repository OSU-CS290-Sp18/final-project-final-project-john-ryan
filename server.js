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

function serveFeeds(docsname, allitems){
    feeder.destroy();
    console.log(docsname[0].feedURLs.length);        
    return new Promise(function(resolve, reject){
	if(docsname[0].feedURLs.length > 0){
	        docsname[0].feedURLs.forEach(function(feedstring){
			console.log(feedstring);
	            feeder.add({
        	        url: feedstring
	            });
        	});
	        feeder.on('new-item', function(item){
        	    allitems.push(item);
	        });
	}
        resolve();
    });
}


app.post('/', function(req, res){
//	console.log(req.body);

	if(req.body.follow.length > 0){
		temp = [];
		sourceList = temp.concat(req.body.follow);

		feedsDB.updateOne(
			{"pageName":"feedList"},
			{$set: {"feedURLs": []}}
		);
	}
		res.status(200).redirect('back');	    	
});


app.get('/', function (req, res, next){
//    console.log(sourceList);
      var allitems = [];
	
    feedsDB.updateOne(
	{"pageName":"feedList"},
	{$set: {"feedURLs": []}}
    );

    sourceList.forEach(function(feed){
    	feedsDB.updateOne(
            {"pageName":"feedList"},
            {$addToSet: {"feedURLs": feed}},
            {upsert: true}
        );
    });

setTimeout(function(){	
    feedsDB.find({"pageName": "feedList"}).toArray(function(err, feedDocs){
        if(err){
            res.status(500).send("Error fetching feeds");
        } else {
//	    console.log(feedDocs[0]);
            serveFeeds(feedDocs, allitems).then(function(){
                setTimeout(function(){
                    res.status(200).render('createFeed', {feeds: allitems, source: defaultFeeds, err404: false});
                }, 1000);
            }).catch( 
		(reason) =>{
			console.log(reason);
	         });
        }
    });
	}, 100);
});




/*app.post(':feedURL', function(req, res, next){});*/

app.get('*', function (req, res) {
    res.status(404).render('404', {err404:true});
});

MongoClient.connect(mongoURL, function(err, client){
    if(err){
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    feedsDB = mongoDB.collection("feedsLists99");
	
    app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });
});

