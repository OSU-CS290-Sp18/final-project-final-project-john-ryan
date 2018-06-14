var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res, next){
    res.status(200).render('createFeed',{home: true, err404: false});
});

app.use(express.static('public'));

app.get('*', function (req, res) {
    res.status(404).render('404',{home: false, err404: true});
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
