/*
 *  Cache Helper
 *  ============
 * 
 *  This helper module provides an interface into an on-disk LRU cache.
 *  The cache exposes get, set, exists, and prune methods for managing
 *  files.
 */

var Q = require('q');
var _ = require('lodash');
var path = require('path');
var log = require('../config/log').createLoggerForFile(__filename);
var fs = require('fs');
var config = require('../config/config');

var folder;
var cachePathIsAbsolute = config.cache.path.indexOf('/') === 0;
if (cachePathIsAbsolute) {
  folder = config.cache.path;
} else {
  folder = path.join(__dirname, '..', '..', config.cache.path);
}

module.exports = {
  isActive: fs.existsSync(folder),
};

if (!module.exports.isActive) {
  log.warn('Cache folder missing. To enable caching, please mkdir ' + folder + ' and restart.');
}

/**
 * Asynchronously get a value from the on-disk cache, if it exists.
 * If a file does not exist, null will be returned.
 * If the cache directory does not exist, null will be returned.
 * 
 * @param {String} key
 * @return {Promise[Either[String, null]]}
 */
module.exports.get = function(key) {
  var filename = key + config.cache.defaultSuffix;
  var filepath = path.join(folder, filename);
  return Q.nfcall(fs.readFile, filepath).then(function(bytes) {
    //  Touch the file again to update its mtime.
    var mtime = parseInt((+new Date()) / 1000, 10);
    fs.utimes(filepath, mtime, mtime);

    return bytes.toString();
  }).catch(function(err) {
    if (err.code === 'ENOENT') {
      return null;
    } else {
      throw err;
    }
  });
};

/**
 * Asynchronously save a value to the on-disk cache.
 * If the cache directory does not exist, null will be returned.
 * 
 * @param {String} key
 * @param {String} value
 * @return {Promise[undefined]}
 */
module.exports.set = function(key, value) {
  var filename = key + config.cache.defaultSuffix;
  return Q.nfcall(fs.writeFile, path.join(folder, filename), value)
    .catch(function(err) {
      if (err.code === 'ENOENT') {
        return null;
      } else {
        throw err;
      }
    });
};

/**
 * Asynchronously check for the existence of
 * a value in the on-disk cache.
 * 
 * @param {String} key
 * @return {Promise[bool]}
 */
module.exports.exists = function(key) {
  var filename = key + config.cache.defaultSuffix;
  var deferred = Q.defer();
  fs.exists(path.join(folder, filename), function(exists) {
    deferred.resolve(exists);
  });
  return deferred.promise;
};

/**
 * Asynchronously prune the on-disk cache to contain at most
 * config.maxSizeInBytes bytes of data.
 * 
 * @return {Promise[Object]}
 */
module.exports.prune = function() {
  return module.exports.pruneToSize(config.cache.maxSizeInBytes);
};

/**
 * Asynchronously prune the on-disk cache to contain at most
 * sizeLimitInBytes bytes of data, which is passed in.
 * 
 * @param {Number} sizeLimitInBytes
 * @return {Promise[Object]}
 */
module.exports.pruneToSize = function(sizeLimitInBytes) {
  if (typeof sizeLimitInBytes === "undefined") {
    throw new Error("pruneToSize(sizeLimitInBytes) takes one argument.");
  }

  var startTime = +new Date();
  return Q.nfcall(fs.readdir, folder).then(function(files) {
    return Q.all(_.map(files, function(file) {
      return Q.nfcall(fs.stat, path.join(folder, file)).then(function(stat) {
        stat.filename = file;
        return stat;
      });
    })).then(function(stats) {
      var result = _(stats).sortBy(function(stat) {
        return stat.mtime.getTime();
      }).reduce(function(acc, stat) {
        acc.currentSize += stat.size;
        if (acc.currentSize > sizeLimitInBytes) {
          acc.filesToDelete.push(stat.filename);
        } else {
          acc.resultingSize += stat.size;
        }
        return acc;
      }, {currentSize: 0, resultingSize: 0, filesToDelete: []});

      return Q.all(_.map(result.filesToDelete, function(file) {
        return Q.nfcall(fs.unlink, path.join(folder, file));
      })).then(function() {
        //  Rename 'filesToDelete' to 'deletedFiles'
        result.deletedFiles = result.filesToDelete;
        delete result.filesToDelete;

        result.deletedBytes = (result.currentSize - result.resultingSize);

        return result;
      });
    }).then(function(result) {
      var endTime = +new Date();
      if (result.deletedBytes > 0) {
        log.info("Pruned " + result.deletedBytes + " bytes from cache. (took " + (endTime - startTime) + " msec)");
      } else {
        log.info("Cache cleanup complete. (no-op) (took " + (endTime - startTime) + " msec)");
      }
      return result;
    });
  });
};