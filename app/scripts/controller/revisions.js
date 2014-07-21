angular.module('wikiwash').controller('RevisionsController', ['$scope', '$window', 'socket', 
  function($scope, $window, socket) {
    
    // change this to set pageName from express route
    socket.emit('cycle page data', {page: $window.location.pathname.replace('/', '')});
    
    $scope.revisions = [];
    
    $scope.getDiff = function (revision) {
      socket.emit('get revision diff', {id: revision.revid, parentid: revision.parentid});
    };

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

  }

]);
