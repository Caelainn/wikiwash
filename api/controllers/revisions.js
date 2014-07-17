var http = require('q-io/http');

var events = require('../../config/events');

var endPoint = 'en.wikipedia.org';

var queryPath = function (page) {
  return  "/w/api.php?" +
          "action=query&" +
          "prop=info%7Crevisions&" +
          "format=json&" +
          "inprop=protection%7Curl&" +
          "rvprop=ids%7Cuser%7Cuserid%7Ccomment&" +
          "rvlimit=10&" +
          "titles=" + page
}

module.exports.index = function (page) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(page)
  };
  
  return http.request(options)
  .then(function (response) {
    return response.body.read()
  });                                                                    

};
