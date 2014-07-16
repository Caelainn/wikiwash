var path = require('path');

var pages = require('../api/controllers/pages');

module.exports = function(app) {

  app.get('/api/pages/:id', function(req, res) {
    pages.find(req.params.id, function (pageJson) {
      res.json(pageJson); 
    })
  });

  app.all('*', function (req, res, next) {
    res.sendfile('index.html', { root: path.join(__dirname, '..', 'public/views') })
  })
  
}

