'use strict';
angular.module('speakers', [
  'ionic',
  'ngCordova',
  'ui.router'
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.speakers', {
    url: '/speakers',
    views: {
      'eventView': {
        templateUrl: 'speakers/templates/list.html',
        controller: 'SpeakersListCtrl as ctrl'
      }
    }
  })

    .state('main.speaker', {
    url: '/speakers/:idSpeaker',
    views: {
      'eventView': {
        templateUrl: 'speakers/templates/detail.html',
        controller: 'SpeakerCtrl as ctrl'
      }
    }
  })
});
