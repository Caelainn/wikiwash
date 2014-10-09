var PagesController = require('../api/controllers/pages');
var revisions = require('../api/controllers/revisions');

var delay = 30000;

function emitPageData(pageName, pages, socket) {
  if (!socket.connected || !pages.cycling)
    return;

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
    
    socket.on('cycle page data', function (params) {
      var pages = new PagesController();
      emitPageData(params.page, pages, socket); 
      
      socket.on('stop cycle', function () {
        pages.cycling = false;
      });
    });
    
    socket.on('disconnect', function () {
      console.log("user disconnected");
    });

  });
};
