var express    = require('express');
var bodyParser = require('body-parser');
var partials   = require('express-partials');
var path       = require('path');

var config   = require('./config/config');
var routes   = require('./config/routes');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')))
app.use('/css', express.static(path.join(__dirname, 'public', 'css')))
app.use('/views', express.static(path.join(__dirname, 'public', 'views')))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(partials());

app.set('views', config.root + '/public/views')

routes(app);

app.listen(3000);
console.log("App listening on port 3000");

