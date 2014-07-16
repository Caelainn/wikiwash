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

module.exports.index = function (page, req, res) {
  var options = {
    host: endPoint,
    path: queryPath(page)
  };

  http.get(options, function(resp) {
    resp.pipe(res);
  });
};
