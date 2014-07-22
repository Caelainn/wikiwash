angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', '$routeParams', 'socket', 'revision',
  function($scope, $sce, $routeParams, socket, revision) {
    debugger;
    $scope.revisionBody = $sce.trustAsHtml(revision.data); 

    if (!$scope.$parent.cycling) {
      socket.emit('cycle page data', {page: $scope.$parent.pageName});
    }

  }

]);
