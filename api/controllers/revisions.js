var revision = require('../models/revision');

module.exports.diffShow = function (revisionId, previousId, callback) {
  revision.getRevisionDiff(revisionId, previousId, function (diffHtml) {
    callback(diffHtml);
  });
};
