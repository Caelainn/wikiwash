angular.module('wikiwash').factory('socket', ['socketFactory', function(socketFactory) {
  return socketFactory();
}]);
