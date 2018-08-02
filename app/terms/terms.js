'use strict';
angular.module('terms', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.terms', {
    url: '/terms',
    views: {
      'eventView': {
        templateUrl: 'terms/templates/terms.html',
        controller: 'TermsCtrl as ctrl'
      }
    }
  })
    .state('terms', {
    url: '/terms/{term}',
    templateUrl: 'terms/templates/terms.html',
    controller: 'TermsCtrl as ctrl'
  })
    .state('main.policy', {
    url: '/policy',
    views: {
      'eventView': {
        templateUrl: 'terms/templates/terms.html',
        controller: 'PolicyCtrl as ctrl'
      }
    }
  })
    .state('policy', {
    url: '/policy/{term}',
    templateUrl: 'terms/templates/terms.html',
    controller: 'PolicyCtrl as ctrl'
  });
});
