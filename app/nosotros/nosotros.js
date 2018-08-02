'use strict';
angular.module('nosotros', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

  //States information about Moveconcerts
  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.nosotros', {
    url: '/nosotros',
    views: {
      'eventView': {
        templateUrl: 'nosotros/templates/nosotros.html',
        controller: 'nosotrosCtrl as ctrl'
      }
    }
  })
    .state('nosotros', {
    url: '/nosotros/{nosotros}',
    templateUrl: 'nosotros/templates/nosotros.html',
    controller: 'nosotrosCtrl as ctrl'
  })
    .state('main.policyn', {
    url: '/policyn',
    views: {
      'eventView': {
        templateUrl: 'nosotros/templates/nosotros.html',
        controller: 'PolicynCtrl as ctrl'
      }
    }
  })
    .state('policyn', {
    url: '/policyn/{nosotros}',
    templateUrl: 'nosotros/templates/nosotros.html',
    controller: 'PolicynCtrl as ctrl'
  });
});
