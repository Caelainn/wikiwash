angular.module('wikiwash').controller('RevisionsController', ['$scope', '$window', 'socket', 
  function($scope, $window, socket) {
    
    // change this to set pageName from express route
    socket.emit('cycle page data', {page: $window.location.pathname.replace('/', '')});
    
    $scope.revisions = [];
    
    $scope.getDiff = function (id) {
      socket.emit('get revision diff', {id: id});
    };

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

  }

]);
