var http = require('q-io/http');
var _ = require('lodash');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var log = require('../config/log').createLoggerForFile(__filename);

var endPoint = 'en.wikipedia.org';

var revisionRequestLimit = 50;

var queryPath = function (pageName) {
  return "/w/api.php?" +
         "action=query&" +
         "prop=info|revisions&" +
         "format=json&" +
         "rvprop=ids|user|userid|comment|timestamp|flags|size&" +
         "rvlimit=" + revisionRequestLimit + "&" +
         "titles=" + pageName
}

// there is an api option to return revisions starting at a given id:
// *rvstartid* but it seems to be broken.
var rmPreviousRevisions = function (current, lastRevisionIds) {
  var newRevisions = current.filter(function (revision) {
    var lastContainedInCurrent = lastRevisionIds.some(function (lastId) {
      return lastId === revision.revid;
    });

    return !lastContainedInCurrent;
  });

  return newRevisions;
};

var pageData = function (body, lastRevisionIds) {
  // only one page returned

  var json = JSON.parse(body);
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];

  var revs = queryResPage.revisions || []

  return {
    title: queryResPage.title,
    revisions: rmPreviousRevisions(revs, lastRevisionIds)
  }
};

module.exports.findRevisions = function (pageName, lastRevisionIds, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(pageName)
  };

  http.request(options).then(function (response) {
    return response.body.read();
  }).then(function (body) {
    data = pageData(body, lastRevisionIds);
    
    if (WikipediaHelper.cacheActive) {
      var revisionIDs = _.map(data.revisions, 'revid');
      log.info("Pre-caching " + revisionIDs.length + " revisions of page '" + pageName + "'...");
      WikipediaHelper.cacheRevisions(revisionIDs)
        .then(function() {
          log.info("Pre-cached " + revisionIDs.length + " revisions of page '" + pageName + "'.");
        }).catch(function(err) {
          log.warn("Error caching revisions for page '" + pageName + "': ", err);
        });
    }

    callback(data);
  }).done();
};
