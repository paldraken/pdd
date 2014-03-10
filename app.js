
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.bodyParser());
app.use(express.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// routes
require('./routes/pdd')(app);
require('./routes/site')(app);

// development only
//if ('development' == app.get('env')) {
////  app.use(express.errorHandler());
//}

app.use(function(req, res, next) {
    res.status(404);
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
        res.json(err);
    } else {
        res.render("error", {error: 404});
    }
});

http.createServer(app).listen(config.get('port'), function(){
  console.log('Express server listening on port ' + config.get('port'));
});
