angular.module('wikiwash').controller('PagesController', ['$scope', '$location', '$routeParams', '$routeSegment', 'socketService', 
  function($scope, $location, $routeParams, $routeSegment, socketService) {

    $scope.pageName = $routeParams.page;
    $scope.revisions = [];

    socketService.socket.emit('cycle page data', {page: $routeParams.page});
    socketService.cycling = true;
    
    $scope.getDiff = function (revision) {
      var params = {page: $scope.pageName, revId: revision.revid + "-" + revision.parentid};
      $location.path($routeSegment.getSegmentUrl('p.revision', params));
      
      if ($routeSegment.chain.length > 1)
        $routeSegment.chain[1].reload();
    };

    socketService.socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

    $scope.selectedIndex = 0; // Whatever the default selected index is, use -1 for no selection
    $scope.itemClicked = function ($index) {
      $scope.selectedIndex = $index;
    };

  }
]);
