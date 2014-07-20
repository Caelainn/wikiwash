var _ = require('lodash');

var pages = require('../api/controllers/pages');
var revisions = require('../api/controllers/revisions');
var delay = 5000;

module.exports = function(io, pageName) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    function emitPageData() {
      pages.show(pageName, function (pageData) {
        socket.emit('new revisions', pageData);
      });

      setTimeout(function () {
        emitPageData(); 
      }, delay);
    };
    
    // emitPageData();
    
    socket.on('revision diff', function (params) {
      var id = params.id;
      var previousRevisionIndex = _.indexOf(revisions.previousRevisionIds, id) - 1;
      var previousRevisionId = revisions.previousRevisionIds[previousRevisionIndex];

      revisions.diffShow(id, previousRevisionId, function (diffHtml) {
        socket.emit(diffHtml);
      });
    });
  });
};

