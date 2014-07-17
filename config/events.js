var page = require('../api/models/page');

var delay = 1000;
var lastRevisionId = null; 

module.exports = function(io, page) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    function emitPageData() {
      page.findRevisions(page, lastRevisionId).then(function (pageData) {
        setTimeout(function () {
          console.log(pageData);
          
          if (Object.keys(pageData).length) {
            socket.emit('new revisions', JSON.parse(pageData));
            lastRevisionId = pageData['lastRevisionId'];
          };

          emitPageData(); 

        }, delay);
      })
    };
    
    emitPageData();
  });
};

