var Q    = require('q'),
    fs   = require('fs'),
    path = require('path'),
    _    = require('lodash');

var log         = require('../backend/config/log').createLoggerForFile(__filename);
var TopArticles = require('../backend/helpers/TopArticles.js');
var Page        = require('../backend/models/Page');

var targetPath = path.join(__dirname, '..', 'data', TopArticles.topArticlesFilename);

var processArticleEntries = function(data) {
  log.info("Fetched " + data.length + " top articles from the past hour.");
  var funcs = _.map(data, function(element) {
    var page = element[0];
    return function() {
      var deferred = Q.defer();
      log.info("Fetching revision list for page " + page + "...");
      Page.findRevisions(page, [], function() {
        log.info("Fetched revision list for page " + page + ".");
        deferred.resolve();
      });
      return deferred.promise;
    };
  });
  return funcs.reduce(Q.when, Q());
};

try {
  log.info("Trying to grab top articles from local cache file...");
  var stat = fs.statSync(targetPath);
  
  var now = +new Date();
  var fileUpdatedAt = +stat.mtime;

  if (fileUpdatedAt - now > (60 * 60 * 1000)) {
    log.info("Top articles list is out of date. Re-fetching...");
    TopArticles().then(processArticleEntries).done();
  } else {
    var file = fs.readFileSync(targetPath, {encoding: 'utf-8'});
    processArticleEntries(JSON.parse(file)).done();
  }
} catch (e) {
  log.info("Fetching top articles from the past hour...");
  TopArticles().then(processArticleEntries).done();
}
