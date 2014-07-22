angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', '$routeParams', 'socket', 
  function($scope, $sce, $routeParams, socket) {
    
    $scope.revisionDiffHtml = "";

    $scope.getDiff = function (revision) {
      socket.emit('get revision diff', {id: revision.revid, parentid: revision.parentid});
    };
    
    socket.on('revision diff', function (html) {
      // relying on wikipedia being safe from injection attacks
      $scope.revisionDiffHtml = $sce.trustAsHtml(html);
    });

  }

]);
