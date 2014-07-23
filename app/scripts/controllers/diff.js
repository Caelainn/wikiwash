angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', '$routeParams', 'revision',
  function($scope, $sce, $routeParams, revision) {
    $scope.$parent.loading = false;
    $scope.$parent.revisionBody = $sce.trustAsHtml(revision.data); 
    
  }
]);
