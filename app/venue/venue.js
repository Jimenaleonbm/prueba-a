'use strict';
angular.module('venue', [
  'ionic',
  'ngCordova',
  'ui.router'
])
.config(function ($stateProvider) {

  $stateProvider.state('main.venue', {
      url: '/venue',
      views: {
        eventView: {
          templateUrl: 'venue/templates/venue.html',
          controller: 'VenueCtrl as ctrl'
        }
      }
    });
});
