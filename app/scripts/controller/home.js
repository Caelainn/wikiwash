angular.module('wikiwash').controller('HomeController', ['$scope', '$window', 
  function($scope, $window, mediawikiApi) {
    
    $scope.submit = function() {
      $window.location.href = "/" + $scope.pageName;
    };
    
  }

]);
