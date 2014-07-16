var http = require('http');

var endPoint = 'en.wikipedia.org';

var queryPath = function (page) {
  var path = "/w/api.php?" +
             "action=query&" +
             "prop=info%7Crevisions&" +
             "format=json&" +
             "inprop=protection%7Curl&" +
             "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
             "rvlimit=500&" +
             "titles=" + page

  return path
}

module.exports.find = function (page, callback) {
  var options = {
    host: endPoint,
    path: queryPath(page),
    params: {
      action: 'query'
    }
  };

  http.get(options, function(resp) {
    var output = '';

    resp.on('data', function(chunk) {
      output += chunk;
    });
    
    resp.on('end', function () {
      callback(JSON.parse(output));
    });
    
    resp.on('error', function(e) {
      callback({error: "Error: " + e.message});
    });
  });
};
