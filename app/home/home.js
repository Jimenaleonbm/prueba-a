'use strict';
angular.module('home', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.home', {
    url: '/home',
    views: {
      eventView: {
        templateUrl: 'home/templates/home.html',
        controller: 'HomeCtrl as ctrl'
      }
    }
    //template: '<ion-view view-title="home"></ion-view>',
  });
});
