 
var fs = require('fs');
var path = require('path');

var fetchArticleStats = require('../backend/helpers/TopArticles.js');
var targetPath = path.join(__dirname, '..', 'data', 'topArticles.json');
fetchArticleStats().then(function(data) {
  var json = JSON.stringify(data, null, 2);
  fs.writeFile(targetPath, json, function(err) {
    if (err) {
      throw err;
    }
  });
}).done();
