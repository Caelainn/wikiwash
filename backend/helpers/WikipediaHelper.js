var http = require('q-io/http');
var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var log = require('../config/log').createLoggerForFile(__filename);
var config = require('../config/config');

var cache = require('till')(config.cache.host, config.cache.port);
var cacheSuffix = ".html";

var endPoint = 'en.wikipedia.org';

var queryPath = function (revisionId) {
  return "/w/api.php?action=parse&format=json&maxlag=5&oldid=" + revisionId;
};

var getRevision = function (revisionId) {
  var options = {
    method: 'GET',
    host: endPoint,
    path: queryPath(revisionId)
  };

  log.info("Making a " + options.method + " request to http://" + options.host + options.path);

  var maxAttempts = 5;
  var pauseTime = 5000; //ms
  var makeRequest = function(attemptNumber) {
    if (!attemptNumber) attemptNumber = 0;

    if (attemptNumber > maxAttempts) {
      throw new Error("Maximum number of attempts exceeded for endpoint: " + options.host);
    }

    return http.request(options).then(function(response) {
      if (response.status === 503) {
        log.warn("Received 503 from upstream. Pausing for " + pauseTime + " msec before retrying.");
        return Q.delay(pauseTime).then(function() {
          makeRequest(attemptNumber + 1);
        });
      } else if (response.status === 200) {
        return response.body.read();
      } else {
        return response.body.read().then(function(body) {
          throw new Error("Error " + response.status + " received from upstream: " + body);
        });
      }
    });
  };

  return makeRequest();
};

var getHTMLFromResponse = function(json) {
  return JSON.parse(json)['parse']['text']['*'];
};

var fetchAndCacheRevisionID = function(revisionID) {
  var fetchStart = +new Date();
  return getRevision(revisionID).then(function(data) {
    //  Save our fetched result to the cache, but don't
    //  bother waiting for it to complete before continuing.
    var fetchEnd = +new Date();
    log.info("Fetched revision " + revisionID + " from Wikipedia. (took " + (fetchEnd - fetchStart) + " msec)");

    data = getHTMLFromResponse(data);

    var saveStart = +new Date();
    cache.set(revisionID + cacheSuffix, data).then(function() {
      var saveEnd = +new Date();
      log.info("Saved revision " + revisionID + " to cache. (took " + (saveEnd - saveStart) + " msec)");
    }).done();

    return data;
  });
};


module.exports.getAndCacheRevisions = function(revisionIDs) {
  //  Simultaneously fetch all of the revisions separately.
  //  This way, if any of the revisions are cached, we can
  //  grab those from the cache instantly and wait on the
  //  slower data from Wikipedia itself.
  return Q.all(_.map(revisionIDs, function(revisionID, i) {
    log.info("Fetching revision " + revisionID + " from cache...");
    var fetchStart = +new Date();
    return cache.get(revisionID + cacheSuffix).then(function(reply) {
      if (reply) {
        var fetchEnd = +new Date();
        log.info("Found revision " + revisionID + " in cache. (took " + (fetchEnd - fetchStart) + " msec)");
        return reply;
      } else {
        return fetchAndCacheRevisionID(revisionID);
      }
    });
  }));
};


var cacheQueue = [];
var cacheQueueLimit = 1000;

var processCacheQueue = function() {
  var revisionID = cacheQueue[0];
  if (revisionID) {
    cache.exists(revisionID + cacheSuffix).then(function(exists) {
      if (!exists) {
        log.info("Preemptive cache queue has " + (cacheQueue.length + 1) + " revisions left. Caching...");
        return fetchAndCacheRevisionID(revisionID).then(function() {
          Q.delay(1000).then(function() {
            cacheQueue.shift();
            processCacheQueue();
          });
        }).catch(function(err) {
          log.error("Could not cache revision " + revisionID + ": " + err.toString());
        });
      } else {
        cacheQueue.shift();
        processCacheQueue();
      }
    }).done();
  } else {
    log.info("Preemptive cache queue is empty. Stopping fetch.");
  }
};

module.exports.preemptivelyCache = function(revisionIDs) {
  //  Simultaneously fetch all of the revisions separately.
  //  This way, if any of the revisions are cached, we can
  //  grab those from the cache instantly and wait on the
  //  slower data from Wikipedia itself.
  cache.isActive().then(function(isActive) {
    if (isActive) {
      var cacheQueueBeingProcessed = (cacheQueue.length > 0);
      cacheQueue.push.apply(cacheQueue, revisionIDs);
      cacheQueue = cacheQueue.slice(0, cacheQueueLimit);

      if (!cacheQueueBeingProcessed) {
        processCacheQueue();
      }
    }
  }).done();
};
