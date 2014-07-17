var http = require('q-io/http');
var page = require('../models/page')

var endPoint = 'en.wikipedia.org';

var queryPath = function (pageName, lastRevisionId) {
  path = "/w/api.php?" +
          "action=query&" +
          "prop=info%7Crevisions&" +
          "format=json&" +
          "inprop=protection%7Curl&" +
          "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
          "rvlimit=10&" +
          "titles=" + pageName
  
  if (lastRevisionId) {
    path += ("&rvstartid=" + lastRevisionId);
  };
}

var pageData = function (body) {
  // only one page returned
  var queryResPages = body['query']['pages'];
  var queryResPage = queryResPages[Object.keys(pagesQueryRes)[0]];

  return {
    title: queryResPage["title"],
    lastRevisedId: queryResPage["lastrevid"],
    revisions: queryResPage["revisions"]
  }
};

module.exports.findRevisions = function (pageName, lastRevisionId) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(pageName, lastRevisionId)
  };
  
  return http.request(options).then(function (response) {
    return response.body.read().then(function (body) {
      return pageData(body);
    });
  });
};
