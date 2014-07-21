var _ = require('lodash');

var page = require('../models/page');

function PagesController() {
  this.currentRevisionIds = [];
};

PagesController.prototype.show = function (pageName, callback) {
  console.log("TOTAL REVISIONS", pageName, "=============>", this.currentRevisionIds.length);

  var _this = this;

  page.findRevisions(pageName, this.currentRevisionIds, function (pageData) {

    if (pageData.revisions.length) {

      var ids = pageData.revisions.map(function (revision) {
        return revision.revid;
      }); 

      _this.currentRevisionIds = _this.currentRevisionIds.concat(ids);

      callback(pageData);
    };
  });
};

PagesController.prototype.previousRevisionId = function (id) {
  var index = _.indexOf(this.currentRevisionIds, id);
  
  if (index >= 0 && index < this.currentRevisionIds.length) {
    return this.currentRevisionIds[index + 1];
  } else {
    return -1;
  };
};

module.exports = PagesController;

