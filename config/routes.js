var path = require('path');
var csv = require('express-csv')

var root = path.join(__dirname, '..', 'public/views');

var revisions = require('../api/controllers/revisions');

module.exports = function(app, io) {

  app.get('/api/revisions/:id', function(req, res) {
    var revisionId = req.params.id;

    if (req.query.diff)
      revisionId = [revisionId, req.query.diff];

    revisions.show(revisionId, function (data) {
      res.json(data);
    });
  });
  
  app.get('/faq', function (req, res) {
    res.sendfile('faq.html', { root: root });
  });

  app.get('/', function (req, res) {
    res.sendfile('index.html', { root: root });
  });

  app.all('/*', function (req, res) {
    res.redirect('/#!' + req.path);
  });
};
