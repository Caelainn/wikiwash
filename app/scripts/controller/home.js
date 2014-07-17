angular.module('wikiwash').controller('HomeController', ['$scope', 'socket', 'mediawikiApi', 
  function($scope, socket, mediawikiApi) {
    
    window.socket = socket;
  
    $scope.pageName = "";
    $scope.pageData = "";
    $scope.resp = "";

    $scope.test = "";

    $scope.searchWiki = function() {
      mediawikiApi.getPage($scope.pageName, function (data) {
        $scope.pageData = data;
      })
    };

    $scope.testEmit = function() {
      socket.emit('test message', $scope.test);
      $scope.test = "";
    };   
    
    socket.on("here", function (m) {
      $scope.resp = m;
    });
    
  }

]);
