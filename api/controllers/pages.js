var page = require('../models/page');

// move this to the page model?
module.exports.lastRevisionIds = []; 

module.exports.show = function (pageName, callback) {
  console.log("TOTAL REVISIONS =============> ", module.exports.lastRevisionIds.length)
  page.findRevisions(pageName, module.exports.lastRevisionIds, function (pageData) {

    console.log(pageData);
    if (pageData.revisions.length) {
      // move this to page model
      var ids = pageData.revisions.map(function (revision) {
        return revision.revid;
      }); 

      module.exports.lastRevisionIds = module.exports.lastRevisionIds.concat(ids);

      callback(pageData);
    };
  })
};

