angular.module('wikiwash').controller('HomeController', ['$scope', '$location', 
  function($scope, $location, mediawikiApi) {
    
    $scope.pageName = '';
    $scope.revisions = [];

    
    $scope.submit = function() {
      $location.path($scope.pageName);
    };
    
  }

]);
