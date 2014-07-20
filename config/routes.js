var path = require('path');
var root = path.join(__dirname, '..', 'public/views');

var events = require('./events');

var revisions = require('../api/controllers/revisions');

module.exports = function(app, io) {

  app.get('/api/revisions/:id/diff/:diffRevisionId', function(req, res) {
    revisions.diffShow(req.params.id, req.params.diffRevisionId, function (diffHtml) {
      res.send(diffHtml);
    });
  });
  
  app.all('/', function (req, res) {
    res.sendfile('landing.html', { root: root })
  });
  
  app.all('/:page', function (req, res) {
    events(io, req.params.page);
    res.sendfile('index.html', { root: root })
  });
  
};

