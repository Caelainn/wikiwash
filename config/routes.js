var pages = require('../api/controllers/pages')

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home/index.haml'); 
  });

  app.get('/api/pages/:id', function(req, res) {
    pages.find(req.params.id, function (pageJson) {
      res.json(pageJson); 
    })
  });
  
}

