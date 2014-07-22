angular.module('wikiwash').controller('PagesController', ['$scope', '$routeParams', 'socket', 
  function($scope, $routeParams, socket) {
    $scope.revisions = [];

    socket.emit('cycle page data', {page: $routeParams.page});
    
    $scope.$on('$locationChangeStart', function(event) {
      socket.emit('stop cycle');
    });

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });
  }
]);
