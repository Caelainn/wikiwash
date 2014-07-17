angular.module('wikiwash').controller('RevisionsController', ['$scope', 'socket', 
  function($scope, socket) {
    
    $scope.revisions = "";

    socket.on("new revisions", function (revisions) {
      $scope.revisions += revisions;
    });
    
  }

]);
