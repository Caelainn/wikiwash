angular.module('wikiwash').controller('DiffController', ['$scope', 'socket', 
  function($scope, socket) {
    
    $scope.revisionDiffHtml = "";
    
    $scope.getDiff = function () {
      socket.emit('get revision diff', {id: 615074333, previousRevisionId: 615420163});
    };
    
    socket.on('revision diff', function (html) {
      $scope.revisionDiffHtml = html;
    });
  }

]);
