var users = require('../api/controllers/users');

module.exports = function(io, data) {
  io.on('connection', function(socket) {
    console.log('a user connected');
    
    setInterval(function () {
      socket.emit('new revisions', 'test');
    }, 1000);

    socket.on('test message', function(message) {
      console.log(message);

      socket.emit('here', message);
    }); 

    socket.on('disconnect', function() {
      console.log('user disconnected');
    }); 
  });
};

