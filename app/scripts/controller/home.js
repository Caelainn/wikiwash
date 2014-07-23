angular.module('wikiwash').controller('HomeController', ['$scope', '$location', 'socketService',
  function($scope, $location, socketService) {
    $scope.pageName = '';
    $scope.revisions = [];

    $scope.submit = function() {
      $location.path($scope.pageName);
    };
    
    if (socketService.cycling) {
      socketService.socket.emit('stop cycle');
      socketService.cycling = false;
    }
  }

]);
