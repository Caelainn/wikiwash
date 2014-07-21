angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', 'socket', 
  function($scope, $sce, socket) {
    
    $scope.revisionDiffHtml = "";
    
    socket.on('revision diff', function (html) {

      // if wikipedia is safe from injection attacks, so are we
      $scope.revisionDiffHtml = $sce.trustAsHtml(html);

    });
  }

]);
