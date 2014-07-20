var PagesController = require('../api/controllers/pages');
var revisions = require('../api/controllers/revisions');

var delay = 5000;

module.exports = function(io, pageName) {
  io.on('connection', function(socket) {
    
    var pages = new PagesController();

    console.log('a user connected');
    
    function emitPageData() {
      pages.show(pageName, function (pageData) {
        socket.emit('new revisions', pageData);
      });

      setTimeout(function () {
        emitPageData(); 
      }, delay);
    };
    
    emitPageData();
    
    socket.on('get revision diff', function (params) {
      var id = params.id;
      var previousRevisionId = pages.previousRevisionId(id);
      
      if (previousRevisionId > 0) {
        revisions.diffShow(id, previousRevisionId, function (diffHtml) {
          console.log('~~~~~~~~~~~~~~~');
          socket.emit('revision diff', diffHtml);
        });
      };
    });
  });
};

