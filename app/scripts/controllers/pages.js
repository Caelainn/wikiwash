angular.module('wikiwash').controller('PagesController', ['$scope', '$location', '$routeParams', '$routeSegment', 'socketService', 
  function($scope, $location, $routeParams, $routeSegment, socketService) {

    $scope.revisions = [];
    $scope.loading = true;
    $scope.revisionBody = "";
    $scope.pageName = $routeParams.page;
    
    socketService.socket.emit('cycle page data', {page: $routeParams.page});
    socketService.cycling = true;
    
    $scope.$watch('loading', function () {
      if ($scope.loading) {
        $scope.revisionBody = "LOADING...";
        console.log("loading");
      } else {
        console.log("not loading");
      }
    });
    
    $scope.$on('$routeChangeSuccess', function(next, current) { 
      if ($routeSegment.chain.length > 1)
        $routeSegment.chain[1].reload();
    });

    socketService.socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

    $scope.selectedIndex = 0; // Whatever the default selected index is, use -1 for no selection
    $scope.itemClicked = function ($index) {
      $scope.selectedIndex = $index;
    };

  }
]);
