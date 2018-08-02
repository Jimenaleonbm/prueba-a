'use strict';
angular.module('concerts', [
  'ionic',
  'ngCordova',
  'ui.router'
  // TODO: load other modules selected during generation
])
    .config(function ($stateProvider) {

      $stateProvider.state('global.concerts', {
        url: '/concerts-list',
        views: {
          globalView: {
            templateUrl: 'concerts/templates/list.html',
            controller: 'ConcertsCtrl'
          }
            }
        });


    });
