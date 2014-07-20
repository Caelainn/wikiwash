angular.module('wikiwash').controller('DiffController', ['$scope', 'socket', 
  function($scope, socket) {
    
    $scope.revisionDiffHtml = "";
    
    socket.on('revision diff', function (html) {
      $scope.revisionDiffHtml = html;
    });
  }

]);
