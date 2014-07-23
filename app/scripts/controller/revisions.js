var injections = ['$scope', 'socketService', controllerFunc];
angular.module('wikiwash').controller('RevisionsController', injections);

function controllerFunc($scope, socketService) {
  $scope.revisions = [];
  
  $scope.getDiff = function (revision) {
    var params = {id: revision.revid, parentid: revision.parentid};
    socketService.socket.emit('get revision diff', params);
  };

  socketService.socket.on("new revisions", function (res) {
    $scope.revisions = res.revisions.concat($scope.revisions);
  });
}
