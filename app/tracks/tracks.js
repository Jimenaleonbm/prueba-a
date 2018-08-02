'use strict';
angular.module('tracks', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.tracks', {
    url: '/tracks',
    views: {
      'eventView': {
        templateUrl: 'tracks/templates/tracklist.html',
        controller: 'TracklistCtrl as ctrl',
      }
    }
  }).state('main.track', {
    url: '/tracks/{trackid}',
    params: {
      trackdata: {}
    },
    views: {
      'eventView': {
        templateUrl: 'tracks/templates/trackdetail.html',
        controller: 'TrackdetailCtrl as ctrl',
      }
    }
  });
});
