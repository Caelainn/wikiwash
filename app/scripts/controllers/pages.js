angular.module('wikiwash').controller('PagesController', ['$scope', '$location', '$routeParams', '$routeSegment', 'socketService',
  function($scope, $location, $routeParams, $routeSegment, socketService) {

    $scope.revisions = [];
    $scope.loading = true;
    $scope.revisionBody = "";
    $scope.pageName = $routeParams.page;
    $scope.showAdded = true;
    $scope.showRemoved = true;

    if ($routeParams.revId) {
      $scope.currentRevId = $routeParams.revId.split('-')[0];
    }

    socketService.socket.emit('cycle page data', {page: $routeParams.page});
    socketService.cycling = true;

    $scope.$watch('loading', function () {
      if ($scope.loading) {
        $scope.revisionBody = "";
        console.log("loading");
      } else {
        console.log("not loading");
      }
    });
    
    $scope.$watch('showRemoved', function () {
      if ($scope.showRemoved) {
        $('.subtractions').css('display', 'inline');
      } else {
        $('.subtractions').css('display', 'none');
      }
    });
    
    $scope.$watch('showAdded', function () {
      if ($scope.showAdded) {
        $('.additions').css('display', 'inline');
      } else {
        $('.additions').css('display', 'none');
      }
    });
    
    $scope.$on('$routeChangeSuccess', function(next, current) { 
      if ($routeParams.revId) {

        // want to allow clicking relative links to other wikipedia pages
        // links look like: '/wiki/thing'
        // edge case is the page for "wiki"
        // revisions for that page look like '/wiki/1111-2222'
        if ($routeParams.page == 'wiki') {
          if (!parseInt($routeParams.revId.split('-')[0])) {
            socketService.socket.emit('stop cycle');
            $routeParams.page = $routeParams.revId;
            $location.path($routeParams.revId);
            $routeSegment.chain[0].reload();
            return;
          }
        }

        $scope.currentRevId = $routeParams.revId.split('-')[0];

        if ($routeSegment.chain.length > 1)
          $routeSegment.chain[1].reload();
      }
    });
    
    $scope.$on('$routeChangeStart', function(next, current) { 
      $scope.loading = true;
    });

    socketService.socket.on("new revisions", function (res) {
      $scope.revisions = res.revisions.concat($scope.revisions);
      
      if (!$routeParams.revId) {
        var revId = $scope.revisions[0].revid + "-" + $scope.revisions[0].parentid; 
        var params = {page: $routeParams.page, revId: revId};
        $location.path($routeSegment.getSegmentUrl('p.revision', params));
      };
    });

  }
]);
