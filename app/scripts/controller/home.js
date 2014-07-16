angular.module('wikiwash').controller('HomeController', ['$scope', 'mediawikiApi', 
  function($scope, mediawikiApi) {
  
    $scope.pageName = "";
    $scope.pageData = "Data will go here";

    $scope.searchWiki = function() {
      mediawikiApi.getPage($scope.pageName, function (data) {
        $scope.pageData = data;
      })
    };
  
  }

]);
