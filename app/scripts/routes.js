angular.module('wikiwash').config(['$routeProvider', '$routeSegmentProvider', '$locationProvider',
  function($routeProvider, $routeSegmentProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/partials/search.html',
    //     controller: 'HomeController'
    //   })
    //   .when('/:page', {
    //     templateUrl: 'views/partials/page-revisions.html',
    //     controller: 'PagesController'
    //   });

    
    $routeSegmentProvider
      .when('/', 's')
      .when('/:page', 'p')
      .when('/:page/:revId', 'p.revision')
      .when('/:page/:revId/:diffId', 'p.diff')
    
      .segment('s', {
        templateUrl: '/views/partials/search.html',
        controller: 'HomeController'
      })
      .segment('p', {
        templateUrl: '/views/partials/page-revisions.html',
        controller: 'PagesController'
      })
      .within()
        .segment('revision', {
          templateUrl: '/views/partials/revision.html',
          controller: 'DiffController',
          resolve: {
            revision: ['$route', 'api', function($route, api) {
              return api.getRevision($route.current.params.revId);
            }]
          },
          resolveFailed: {
            templateUrl: 'templates/error.html',
            controller: 'ErrorController'
          }
        })
        .segment('diff', {
          templateUrl: 'views/partials/revision.html',
          controller: 'DiffController',
          resolve: {
            revision: ['$route', 'api', function($route, api) {
              var revId = $route.current.params.revId;
              var prevId = $route.current.params.revId;
              return api.getRevisionDiff(revId, prevId);
            }]
          },
          resolveFailed: {
            templateUrl: 'templates/error.html',
            controller: 'ErrorController'
          }
        });

  }
]);

