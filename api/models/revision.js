var http = require('q-io/http');
var gdiff = require('googlediff');
var _ = require('lodash');
var fs = require('fs');

var endPoint = 'en.wikipedia.org';

var queryPath = function (revisionId, previousRevisionId) {
  return "/w/api.php?" +
         "action=query&" +
         "prop=revisions&" +
         "format=json&" +
         "rvprop=ids%7Cuser%7Cuserid%7Ccomment%7Ccontent" +
         "&rvparse&" +
         "revids=" + revisionId + "|" + previousRevisionId
}

var revisionDiffHtml = function (json, revisionId, previousRevisionId) {
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];

  var revisionHtml = _.find(queryResPage.revisions, function (r) {
    return r.revid == revisionId;
  })['*'];

  var previousHtml = _.find(queryResPage.revisions, function (r) {
    return r.revid == previousRevisionId;
  })['*'];

  var result = "";

  try {
    var diff = new gdiff();

    var diffParts = diff.diff_main(previousHtml, revisionHtml);
    diffParts.forEach(function (part) {
      if (part[0] > 0) {
        result = result + '<span style="background-color: #B8E9D2 !important;">' + part[1] + '</span>';
      } else if (part[0] < 0) {
        result = result + '<span style="background-color: #F1BCBC !important;">' + part[1] + '</span>';
      } else {
        result += part[1];
      }
    });
  } catch (err) {
    result = 'Diff unavailable';
  };

  return result;
};

module.exports.getRevisionDiff = function (revisionId, previousRevisionId, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(revisionId, previousRevisionId)
  };

  console.log(options);

  http.request(options).then(function (response) {
    response.body.read().then(function (body) {
      var json = JSON.parse(body);
      var rDiff = revisionDiffHtml(json, revisionId, previousRevisionId);
      callback(rDiff);
    });
  })
  .catch(function (error) {
    console.log("ERROR", error);
  });
};
