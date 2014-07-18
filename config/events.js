var page = require('../api/models/page');

var delay = 1000;
var minRevisionId = null; 

module.exports = function(io, pageName) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    function emitPageData() {
      page.findRevisions(pageName, minRevisionId, function (pageData) {
        console.log("PAGEDATA ====> ", pageData);
        setTimeout(function () {
          console.log(pageData);
          
          if (Object.keys(pageData).length) {
            socket.emit('new revisions', pageData);
            minRevisionId = (parseInt(pageData['lastRevisionId']));
            console.log(pageData.lastRevisionId)
            console.log("MINREVISIONID", minRevisionId)
          };

          emitPageData(); 

        }, delay);
      })
    };
    
    emitPageData();
  });
};

