var http = require('http');

var endPoint = 'en.wikipedia.org';

var queryPath = function (page) {
  var path = "/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles="
  return path + page
}

module.exports.find = function (page, callback) {
  var options = {
    host: endPoint,
    path: queryPath(page)
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
