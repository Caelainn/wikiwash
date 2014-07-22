var injections = ['$scope', 'socket', controllerFunc];
angular.module('wikiwash').controller('RevisionsController', injections);

function controllerFunc($scope, socket) {
  $scope.revisions = [];
  
  $scope.getDiff = function (revision) {
    socket.emit('get revision diff', {id: revision.revid, parentid: revision.parentid});
  };

  socket.on("new revisions", function (res) {
    $scope.revisions = res.revisions.concat($scope.revisions);
  });
}
