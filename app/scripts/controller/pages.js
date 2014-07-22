angular.module('wikiwash').controller('PagesController', ['$scope', '$location', '$route', '$routeParams', '$routeSegment', 'socket', 
  function($scope, $location, $route, $routeParams, $routeSegment, socket) {

    $scope.pageName = $routeParams.page;
    $scope.revisions = [];

    socket.emit('cycle page data', {page: $routeParams.page});
    $scope.cycling = true;
    
    $scope.$on('$locationChangeStart', function(event) {
      socket.emit('stop cycle');
      $scope.cycling = false;
    });

    $scope.getDiff = function (revision) {
      var params = {page: $scope.pageName, revId: revision.revid + "-" + revision.parentid};
      $location.path($routeSegment.getSegmentUrl('p.revision', params));
      $routeSegment.chain[1].reload();
    };

    socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });
  }
]);
