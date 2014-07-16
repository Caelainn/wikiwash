var path = require('path');

var users = require('../api/controllers/users');

module.exports = function(app) {

  app.get('/api/pages/:id', function(req, res) {
    users.index(req, res)
  });
  
  app.all('/', function (req, res, next) {
    res.sendfile('index.html', { root: path.join(__dirname, '..', 'public/views') })
  })
  
}

