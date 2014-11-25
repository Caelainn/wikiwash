var http = require('q-io/http');
var _ = require('lodash');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var geoip = require('geoip-lite');
var country = require('country-code-lookup');
var log = require('../config/log').createLoggerForFile(__filename);

var endPoint = 'en.wikipedia.org';

var revisionRequestLimit = 50;

var queryPath = function (pageName) {
  return "/w/api.php?" +
         "action=query&" +
         "prop=info|revisions&" +
         "format=json&" +
         "rvprop=ids|user|userid|comment|timestamp|flags|size&" +
         "rvlimit=" + revisionRequestLimit + "&" +
         "titles=" + pageName
}

// there is an api option to return revisions starting at a given id:
// *rvstartid* but it seems to be broken.
var rmPreviousRevisions = function (current, lastRevisionIds) {
  var newRevisions = current.filter(function (revision) {
    var lastContainedInCurrent = lastRevisionIds.some(function (lastId) {
      return lastId === revision.revid;
    });

    return !lastContainedInCurrent;
  });

  return newRevisions;
};

var pageData = function (body, lastRevisionIds) {
  // only one page returned

  var json = JSON.parse(body);
  var queryResPages = json['query']['pages'];
  var queryResPage = queryResPages[Object.keys(queryResPages)[0]];

  var revs = queryResPage.revisions || [];
  revs = rmPreviousRevisions(revs, lastRevisionIds);
  revs = _.map(revs, function(rev) {
    if ('anon' in rev) {
      var geo = geoip.lookup(rev.user);
      if (geo) {
        var countryName = geo.country;
        var countryInfo = country.byIso(countryName);
        if (countryInfo) {
          countryName = countryInfo.country;
        }

        rev.geo = _.compact([geo.city, geo.region, countryName]).join(', ');
      }
    }
    return rev;
  });

  return {
    title: queryResPage.title,
    revisions: revs,
  };
};

module.exports.findRevisions = function (pageName, lastRevisionIds, callback) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(pageName)
  };

  http.request(options).then(function (response) {
    return response.body.read();
  }).then(function (body) {
    data = pageData(body, lastRevisionIds);
    
    WikipediaHelper.preemptivelyCache(_.map(data.revisions, 'revid'));

    callback(data);
  }).done();
};
