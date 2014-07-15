var express    = require('express');
var bodyParser = require('body-parser');
var engines    = require('consolidate');
var partials   = require('express-partials');

var config   = require('./config/config');
var routes   = require('./config/routes');

var app = express();

app.use(express.static(__dirname + '/app/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(partials());

app.engine('haml', engines.haml);
app.set('views', config.root + '/app/views')

routes(app);

app.listen(8080);
console.log("App listening on port 8080");

