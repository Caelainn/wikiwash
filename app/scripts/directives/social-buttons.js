angular.module('wikiwash')
.directive('socialButtons', function($window, $location) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/views/directives/social-buttons.html',
    controller: function($scope, $location) {
      $scope.urls = {
        "facebook": "https://www.facebook.com/sharer/sharer.php?u=",
        "linkedin": "https://www.linkedin.com/shareArticle?mini=true&url=",
        "twitter": "https://twitter.com/home?status=" 
      };

      $scope.shareUrl = function(url) {
        return url + $location.absUrl();
      };
    }
  };
});
