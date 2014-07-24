var http = require('q-io/http');
var gdiff = require('googlediff');
var _ = require('lodash');
var fs = require('fs');

var endPoint = 'en.wikipedia.org';

var queryPath = function (revisionId) {
  if (_.isArray(revisionId)) {
    var revids = revisionId.join("|");
  } else { 
    var revids = revisionId;
  };

  return "/w/api.php?" + 
         "action=query&" + 
         "prop=revisions&" + 
         "format=json&" + 
         "rvprop=ids|user|userid|comment|content&" +
         "rvparse&" +
         "revids=" + revids;
}

var revisionHtml = function (json, revId) {
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];
  
  return _.find(queryResPage.revisions, function (r) {
    return r.revid == revId;
  })['*'];
};

var revisionDiffHtml = function (json, revHtml, prevHtml) {
  var result = "";
  
  try {
    var diff = new gdiff();
    
    var diffParts = diff.diff_main(prevHtml, revHtml);
    var editCount = 0;
    diffParts.forEach(function (part, index) {
      if (part[0] > 0) {
       result = result + '<span class="ww-edit additions" id=edit-' + 
                 editCount + '>' + part[1] + '</span>';
        editCount++;
      } else if (part[0] < 0) {
        result = result + '<span class="ww-edit subtractions" id=edit-' + 
                 editCount + '>' + part[1] + '</span>';
        editCount++;
      } else {
        result += part[1];
      }

    });
  } catch (err) {
    result = 'Diff unavailable';
  };
  
  return result;
};

var getRevision = function (revisionId, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(revisionId)
  };
  
  console.log(options);
  
  http.request(options).then(function (response) {
    response.body.read().then(function (body) {
      callback(JSON.parse(body));
    });
  })
  .catch(function (error) {
    console.log("ERROR", error);
  });
};

module.exports.find = function (revisionId, callback) {
  getRevision(revisionId, function (json) {
    var html = "";
    
    if (_.isArray(revisionId)) {
      var prevHtml = revisionHtml(json, revisionId[1]);
      var revHtml = revisionHtml(json, revisionId[0]);
      html = revisionDiffHtml(json, revHtml, prevHtml);
    } else {
      html = revisionHtml(json, revisionId);
    };

    callback(html);
  });
};
