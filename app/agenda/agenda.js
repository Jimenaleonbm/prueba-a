'use strict';
angular.module('agenda', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

    // ROUTING with ui.router
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('main.agenda', {
        url: '/agenda',
        views: {
          eventView: {
            templateUrl: 'agenda/templates/agenda.html',
            controller: 'AgendaCtrl as ctrl'
          }
        }
      })
      .state('main.session', {
        url: '/agenda/:sessionid',
        views: {
          eventView: {
            templateUrl: 'agenda/templates/session.html',
            controller: 'SessionCtrl as ctrl'
          }
        }
      })
      .state('main.sessiontype', {
        url: '/session-type/:typeid',
        views: {
          eventView: {
            templateUrl: 'agenda/templates/agenda.html',
            controller: 'SesiontypeCtrl as ctrl'
          }
        }
      });
  });
