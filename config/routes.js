var pages = require('../app/controllers/api/pages')

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('home/index.haml'); 
  });

  app.get('/api/pages', function(req, res) {
    res.json(pages.test); 
  });
  
}

