var revisions = require('../api/controllers/revisions');

module.exports = function(io, page) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    setInterval(function () {
      revisions.index(page).then(function (body) {
        console.log(JSON.parse(body));
        socket.emit('new revisions', JSON.parse(body));
      })
    }, 1000);

  });
};

