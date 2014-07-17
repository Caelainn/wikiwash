angular.module('wikiwash').controller('HomeController', ['$scope', '$window', 
  function($scope, $window, mediawikiApi) {
    
    $scope.pageName = "";
    $scope.pageData = "";

    $scope.test = "";

    $scope.submit = function() {
      $window.location.href = "/" + $scope.pageName;
    };
    
  }

]);
