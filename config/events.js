var pages = require('../api/controllers/pages');
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
    
    emitPageData();
  });
};

