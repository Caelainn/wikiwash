var page = require('../models/page');

// move this to the page model?
var lastRevisionIds = []; 

module.exports.show = function (pageName, callback) {
  console.log("TOTAL REVISIONS =============> ", lastRevisionIds.length)
  page.findRevisions(pageName, lastRevisionIds, function (pageData) {
    // console.log("PAGEDATA ====> ", pageData);

    console.log(pageData);
    if (pageData.revisions.length) {
      callback(pageData);

      // move this to page model
      var ids = pageData.revisions.map(function (revision) {
        return revision.revid;
      }); 

      lastRevisionIds = lastRevisionIds.concat(ids);
    };
  })
};


