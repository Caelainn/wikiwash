angular.module('wikiwash').factory('socketService',
  function(socketFactory) {
    return {
      socket: socketFactory(),
      cycling: false
    };
  }
);
