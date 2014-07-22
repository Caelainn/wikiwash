angular.module('wikiwash').controller('DiffController', ['$scope', '$sce', 'socket', 'revision',
  function($scope, $sce, socket, revision) {

    $scope.revisionBody = $sce.trustAsHtml(revision.data); 
    
    $scope.getDiff = function (revision) {
      socket.emit('get revision diff', {id: revision.revid, parentid: revision.parentid});
    };
    
    socket.on('revision diff', function (html) {
      // relying on wikipedia being safe from injection attacks
      $scope.revisionDiffHtml = $sce.trustAsHtml(html);
    });

  }

]);
