'use strict';
angular.module('twitter', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ngCordovaOauth',
  'ngTwitter'
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider) {

  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main.twitter', {
    url: '/twitter',
    views: {
      eventView: {
        templateUrl: 'twitter/templates/hashtag.html',
        controller: 'HashtagCtrl as ctrl'
      }
    }
  })
});

