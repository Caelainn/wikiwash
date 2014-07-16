angular.module('wikiwash').controller('HomeController', ['$scope', 'socket', 'mediawikiApi', 
  function($scope, socket, mediawikiApi) {
    
    debugger;
  
    $scope.pageName = "";
    $scope.pageData = "";

    $scope.searchWiki = function() {
      mediawikiApi.getPage($scope.pageName, function (data) {
        $scope.pageData = data;
      })
    };
  
  }

]);
