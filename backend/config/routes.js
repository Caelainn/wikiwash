var path = require('path');
var csv  = require('express-csv');

var root = path.join(__dirname, '..', '..', 'public', 'views');

var revisions = require('../controllers/RevisionsController');
var suggestions = require('../controllers/SuggestionsController');

module.exports = function(app, io) {
  app.get('/api/revisions/:id', function(req, res) {
    var revisionId = req.params.id;

    if (req.query.diff)
      revisionId = [revisionId, req.query.diff];

    revisions.show(revisionId, function (data) {
      res.json(data);
    });
  });


  app.get('/api/suggestions', function(req, res) {
    suggestions.index(function(data) {
      res.json(data);
    });
  });
  
  app.get('/docs', function (req, res) {
    res.sendfile('docs.html', { root: root });
  });

  app.get('/', function (req, res) {
    res.sendfile('index.html', { root: root });
  });

  app.all('/*', function (req, res) {
    res.redirect('/#!' + req.path);
  });
};
