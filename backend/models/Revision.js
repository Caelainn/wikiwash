var _ = require('lodash');
var DiffFormatter = require('../helpers/DiffFormatter');
var WikipediaHelper = require('../helpers/WikipediaHelper');
var log = require('../config/log').createLoggerForFile(__filename);

module.exports.find = function (revisionIDs, callback) {
  if (!Array.isArray(revisionIDs)) {
    revisionIDs = [revisionIDs];
  }

  WikipediaHelper.getAndCacheRevisions(revisionIDs).then(function(blobs) {
    var data = {};

    if (blobs.length === 2) {
      var prevHtml = blobs[1];
      var revHtml = blobs[0];

      return new DiffFormatter(revHtml, prevHtml).generateDiff();
    } else {
      return {content: blobs[0], added: 0, removed: 0};
    }
  }).then(function(data) {
    callback(data);
  }).catch(function(err) {
    log.error(err);
    callback({content: "An error occurred.", added: 0, removed: 0});
  });
};
