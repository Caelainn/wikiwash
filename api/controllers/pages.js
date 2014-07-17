var http = require('q-io/http');
var page = require('../models/page')

var endPoint = 'en.wikipedia.org';

var queryPath = function (page, lastRevisionId) {
  path = "/w/api.php?" +
          "action=query&" +
          "prop=info%7Crevisions&" +
          "format=json&" +
          "inprop=protection%7Curl&" +
          "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
          "rvlimit=10&" +
          "titles=" + page
  
  if (lastRevisionId) {
    path += ("&rvstartid=" + lastRevisionId);
  };
}

var setLastRevisionIds = function (pages) {
  var ids = [];
  for (page in pages.keys) {
    ids.push(page[page].lastrevid)
  }
  
  module.exports.lastRevisionIds = ids;
};

module.exports.index = function (page, lastRevisionId) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(page, lastRevisionId)
  };
  
  return http.request(options).then(function (response) {
    return response.body.read().then(function (body) {
      return revisions(body);
    });
  });
};

module.exports.revisions = function (body) {
  var pages = body['query']['pages'];

  setLastRevisionIds(pages);

  for (page in pages.keys) {
    ids.push(page[page].lastrevid)
  }

  return pages[]
};

