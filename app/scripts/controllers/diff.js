angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', '$routeParams', 'revision',
  function($scope, $sce, $routeParams, revision) {
    $scope.revisionBody = $sce.trustAsHtml(revision.data); 
  }

]);
