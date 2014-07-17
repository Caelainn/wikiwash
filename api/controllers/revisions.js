var http = require('q-io/http');
var Q = require('Q');

var events = require('../../config/events');

var endPoint = 'en.wikipedia.org';

var queryPath = function (page) {
  return  "/w/api.php?" +
          "action=query&" +
          "prop=info%7Crevisions&" +
          "format=json&" +
          "inprop=protection%7Curl&" +
          "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
          "rvlimit=500&" +
          "titles=" + page
}

module.exports.index = function (io) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(req.params.id)
  };
  
  http.request(options)
  .then(function (response) {
    response.body.read()
    .then(function (body) {
      res.json(JSON.parse(body));
    })
  });                                                                    

};
