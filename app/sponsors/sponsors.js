'use strict';
angular.module('sponsors', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main.sponsors', {
      url: '/sponsors',
      views: {
        'eventView': {
          templateUrl: 'sponsors/templates/sponsors.html',
          controller: 'SponsorsCtrl as ctrl'
        }
      }
    })

    .state('main.sponsor', {
      url: '/sponsors/:idSponsor',
      views: {
        'eventView': {
          templateUrl: 'sponsors/templates/sponsor.html',
          controller: 'SponsorCtrl as ctrl'
        }
      }
    });
});
