var http = require('q-io/http');

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
    response.body.read().then(function (body) {
      callback(pageData(body, lastRevisionIds));
    });
  });
};
