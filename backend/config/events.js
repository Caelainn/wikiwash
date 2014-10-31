var PagesController = require('../controllers/PagesController');
var revisions = require('../controllers/RevisionsController');
var log = require('./log').createLoggerForFile(__filename);

var delay = 30000;

function emitPageData(pageName, pages, socket) {
  if (!socket.connected || !pages.cycling)
    return;

  pages.show(pageName, function (pageData) {
    socket.emit('new revisions', pageData);
  });

  
  setTimeout(function() {
    emitPageData(pageName, pages, socket);
  }, delay);
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    log.info('a user connected');
    
    socket.on('cycle page data', function (params) {
      var pages = new PagesController();
      emitPageData(params.page, pages, socket);
      
      socket.on('stop cycle', function () {
        pages.cycling = false;
      });
    });
    
    socket.on('disconnect', function () {
      log.info("user disconnected");
    });

  });
};
