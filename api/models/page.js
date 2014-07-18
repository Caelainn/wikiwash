var http = require('q-io/http');
var page = require('../models/page')

var endPoint = 'en.wikipedia.org';

var queryPath = function (pageName, minRevisionId) {
  path = "/w/api.php?" +
          "action=query&" +
          "prop=info%7Crevisions&" +
          "format=json&" +
          "inprop=protection%7Curl&" +
          "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
          "rvlimit=10&" +
          "titles=" + pageName
  
  if (minRevisionId) {
    path += ("&rvstartid=" + minRevisionId);
  };
  
  return path;
}

var pageData = function (body) {
  // only one page returned
  
  var json = JSON.parse(body);
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];

  return {
    title: queryResPage["title"],
    lastRevisionId: queryResPage["lastrevid"],
    revisions: queryResPage["revisions"]
  }
};

module.exports.findRevisions = function (pageName, lastRevisionId, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(pageName, lastRevisionId)
  };
  
  console.log(options);
  
  http.request(options).then(function (response) {
    response.body.read().then(function (body) {
      callback(pageData(body));
    });
  });
};
