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

var revisionDiffData = function (json, revHtml, prevHtml) {
  var content = "";

  try {
    var diff = new gdiff();
    
    var diffParts = diff.diff_main(prevHtml, revHtml);
    var editCount = 0;
    var totalAdded = 0;
    var totalRemoved = 0;
    diffParts.forEach(function (part, index) {
      if (part[0] > 0) {
       content = content + '<span class="ww-edit additions" id=edit-' + 
                 editCount + '>' + part[1] + '</span>';
        editCount++;
        totalAdded++
      } else if (part[0] < 0) {
        content = content + '<span class="ww-edit subtractions" id=edit-' + 
                 editCount + '>' + part[1] + '</span>';
        editCount++;
        totalRemoved++;
      } else {
        content += part[1];
      }

    });
  } catch (err) {
    content = 'Diff unavailable';
  };
  
  return {content: content, added: totalAdded, removed: totalRemoved};
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
    var data = {};
    
    if (_.isArray(revisionId)) {
      var prevHtml = revisionHtml(json, revisionId[1]);
      var revHtml = revisionHtml(json, revisionId[0]);
      data = revisionDiffData(json, revHtml, prevHtml);
    } else {
      data = {content: revisionHtml(json, revisionId), added: 0, removed: 0};
    };

    callback(data);
  });
};
