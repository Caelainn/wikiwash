angular.module('wikiwash').controller('RevisionsController', ['$scope', '$routeParams', 'socket', 
  function($scope, $routeParams, socket) {
    
    socket.emit('cycle page data', {page: $routeParams.page});
    
    $scope.revisions = [];
    
    $scope.getDiff = function (revision) {
      socket.emit('get revision diff', {id: revision.revid, parentid: revision.parentid});
    };

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

  }

]);
