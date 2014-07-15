var express  = require('express');
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config/config');
var engines = require('consolidate');
var partials = require('express-partials');

var routes   = require('./config/routes');
var app      = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(partials());

app.engine('haml', engines.haml);
app.set('views', config.root + '/app/views')
app.set("view options", { layout: "/views/layouts/application.haml" });

routes(app);

app.listen(8080);
console.log("App listening on port 8080");

