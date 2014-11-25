var moment = require('moment'),
    Q      = require('q'),
    _      = require('lodash');

var log         = require('../backend/config/log').createLoggerForFile(__filename);
var TopArticles = require('../backend/helpers/TopArticles.js');
var Page        = require('../backend/models/Page');

log.info("Fetching top articles from the past hour...");
TopArticles().then(function(data) {
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
}).done();
