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
        "twitter": "https://twitter.com/intent/tweet?text=Check%20out%20WikiWash,%20a%20tool%20for%20tracking%20edits%20on%20Wikipedia!&hashtags=wikiwash&related=twg,metrotoronto,CIRonline&url="
      };

      $scope.shareUrl = function(url) {
        return url + $window.escape($location.absUrl());
      };
    }
  };
});
