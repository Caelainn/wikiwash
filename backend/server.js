var express    = require('express');
var bodyParser = require('body-parser');
var partials   = require('express-partials');
var path       = require('path');

var config = require('./config/config');
var routes = require('./config/routes');
var events = require('./config/events');

var log = require('./config/log').createLoggerForFile(__filename);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use("/frontend/assets", express.static(path.join(__dirname, '..', 'frontend', 'assets')));
app.use('/img', express.static(path.join(__dirname, '..', 'frontend', 'assets', 'img')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')));
app.use('/views', express.static(path.join(__dirname, '..', 'public', 'views')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(partials());

app.set('views', path.join(__dirname, '..', 'public', 'views'));

routes(app);
events(io);

http.listen(process.env.PORT || 3000, function(){
  log.info('WikiWash listening on *:' + (process.env.PORT || 3000));
});
