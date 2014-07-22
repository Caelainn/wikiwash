angular.module('wikiwash').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/partials/search.html',
        controller: 'HomeController'
      })
      .when('/:page', {
        templateUrl: 'views/partials/page-revisions.html',
        controller: 'PagesController'
      });
  }
]);
