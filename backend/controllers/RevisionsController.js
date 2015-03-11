var log = require('../config/log').createLoggerForFile(__filename);
var Revision = require('../models/Revision');

module.exports.show = function(revisionId, callback) {
  Revision.find(revisionId, function(err, data) {
    callback(err, data);
  });
};
