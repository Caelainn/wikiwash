var http = require('q-io/http');
var page = require('../models/page')

var endPoint = 'en.wikipedia.org';

var queryPath = function (pageName) {
  path = "/w/api.php?" +
          "action=query&" +
          "prop=info|revisions&" +
          "format=json&" +
          "rvprop=ids|user|userid|comment|timestamp|size&" +
          "rvlimit=10&" +
          "titles=" + pageName
  
  return path;
}

// there is an api option to return revisions starting at a given id:
// **rvstartid** but it seems to be broken. 
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
  
  return {
    title: queryResPage.title,
    revisions: rmPreviousRevisions(queryResPage.revisions, lastRevisionIds)
  }
};

module.exports.findRevisions = function (pageName, lastRevisionIds, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(pageName)
  };
  
  console.log(options);
  
  http.request(options).then(function (response) {
    response.body.read().then(function (body) {
      callback(pageData(body, lastRevisionIds));
    });
  });
};
