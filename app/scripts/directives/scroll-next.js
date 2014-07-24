angular.module('wikiwash')
  .directive('scrollNext', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return function(scope, element, attr) {
      
      element.on('click', function(event) {
        event.preventDefault();

        console.log("click");
        $location.hash('');
      });

    };
  }]);
