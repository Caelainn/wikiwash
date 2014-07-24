var revision = require('../models/revision');

module.exports.show = function (revisionId, callback) {
  revision.find(revisionId, function (data) {
    callback(data);
  });
};
