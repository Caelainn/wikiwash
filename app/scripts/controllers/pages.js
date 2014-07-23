angular.module('wikiwash').controller('PagesController', ['$scope', '$location', '$routeParams', '$routeSegment', 'socketService', 
  function($scope, $location, $routeParams, $routeSegment, socketService) {

    $scope.revisions = [];
    $scope.loading = true;
    $scope.revisionBody = "";
    $scope.pageName = $routeParams.page;

    if ($routeParams.revId) {
      $scope.currentRevId = $routeParams.revId.split('-')[0];
    }
    
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
      $scope.currentRevId = $routeParams.revId.split('-')[0];

      if ($routeSegment.chain.length > 1)
        $routeSegment.chain[1].reload();
    });
    
    $scope.$on('$routeChangeStart', function(next, current) { 
      $scope.loading = true;
    });

    socketService.socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
    });

  }
]);
