var log  = require('../config/log').createLoggerForFile(__filename);
var fs   = require('fs');
var path = require('path');

var TopArticles = require('../helpers/TopArticles');

//  Rather than add a database as a dependency, here we just
//  reference a single JSON blob of the most recent Wiki articles.
var suggestionsFilename = path.join(__dirname, '..', '..', 'data', TopArticles.topArticlesFilename);

var suggestionsCache = [];
var suggestionsLastMtime = 0;

module.exports.index = function (callback) {
  fs.stat(suggestionsFilename, function(err, stats) {
    if (err) {
      log.warn("Could not load suggestion data: " + err.toString());
      callback(suggestionsCache);
    } else {
      if (stats.mtime !== suggestionsLastMtime) {
        fs.readFile(suggestionsFilename, function(err, data) {
          if (err) {
            log.warn("Could not read suggestion data: " + err.toString());
          } else {
            suggestionsLastMtime = stats.mtime;
            suggestionsCache = JSON.parse(data.toString());
          }
          callback(suggestionsCache);
        });
      } else {
        callback(suggestionsCache);
      }
    }
  });
};
