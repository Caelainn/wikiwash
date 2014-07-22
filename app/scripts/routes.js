angular.module('wikiwash').config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        templateUrl: 'views/partials/search.html',
        controller: 'HomeController'
      })
      .when('/:page', {
        templateUrl: 'views/partials/page-revisions.html',
        controller: 'PagesController'
      })
      .when('/:page/:revisionId', {
        controller: 'RevisionsController'
      });

  }
]);

