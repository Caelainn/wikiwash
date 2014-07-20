angular.module('wikiwash').controller('RevisionsController', ['$scope', 'socket', 
  function($scope, socket) {
    
    $scope.revisions = [];
    
    $scope.getDiff = function (id) {
      socket.emit('get revision diff', {id: id});
    };

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

  }

]);
