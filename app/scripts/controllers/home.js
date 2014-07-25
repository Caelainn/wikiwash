angular.module('wikiwash').controller('HomeController', ['$scope', '$location', 'socketService', 'pageParser',
  function($scope, $location, socketService, pageParser) {
    $scope.pageName = '';
    $scope.revisions = [];

    $scope.submit = function() {
      $location.path(pageParser.getPageName($scope.pageName));
    };
    
    if (socketService.cycling) {
      socketService.socket.emit('stop cycle');
      socketService.cycling = false;
    }
  }

]);
