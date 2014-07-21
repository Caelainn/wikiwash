var PagesController = require('../api/controllers/pages');
var revisions = require('../api/controllers/revisions');

var delay = 5000;

function emitPageData(pageName, pages, socket) {
  pages.show(pageName, function (pageData) {
    socket.emit('new revisions', pageData);
  });

  setTimeout(function () {
    emitPageData(pageName, pages, socket); 
  }, delay);
};

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    var pages = new PagesController();

    socket.on('cycle page data', function (params) {
      emitPageData(params.page, pages, socket); 
    });
    
    socket.on('get revision diff', function (params) {
      var id = params.id;
      var previousRevisionId = pages.previousRevisionId(id);
      
      if (previousRevisionId > 0) {

        revisions.diffShow(id, previousRevisionId, function (diffHtml) {
          console.log('~~~~~~~~~~~~~~~');
          socket.emit('revision diff', diffHtml);
        });
      } else {
        socket.emit('revision diff', "Diff unavailable");
      };
    });
    
    socket.on('disconnect', function () {
      console.log("user disconnected");
    });

  });
};

