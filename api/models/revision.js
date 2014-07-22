var http = require('q-io/http');
var gdiff = require('googlediff');
var _ = require('lodash');
var fs = require('fs');

var endPoint = 'en.wikipedia.org';

var queryPath = function (revisionId, previousRevisionId) {
  path = "/w/api.php?" + 
         "action=query&" + 
         "prop=revisions&" + 
         "format=json&" + 
         "rvprop=ids%7Cuser%7Cuserid%7Ccomment%7Ccontent&" +
         "rvparse&" +
         "revids=" + revisionId
  
  if (previousRevisionId)
    path = path + "|" + previousRevisionId;
  
  return path;
}

var revisionHtml(json, revId) {
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];

  var revisionHtml = _.find(queryResPage.revisions, function (r) {
    return r.revid == revId;
  })['*'];
};

var revisionDiffHtml = function (json, revHtml, prevHtml) {
  var result = "";
  
  try {
    var diff = new gdiff();

    var diffParts = diff.diff_main(preHtml, revHtml);
    diffParts.forEach(function (part) {
      if (part[0] > 0) {
        result = result + '<span style="color: green;">' + part[1] + '</span>';
      } else if (part[0] < 0) {
        result = result + '<span style="color: red;">' + part[1] + '</span>';
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
      var revisionHtml = revisionHtml(revisionId);
      var previousHtml = revisionHtml(previousRevisionId);
      var rDiff = revisionDiffHtml(json, revisionHtml, previousHtml);

      callback(rDiff);
    });
  })
  .catch(function (error) {
    console.log("ERROR", error);
  });
};
