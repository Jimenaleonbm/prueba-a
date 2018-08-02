'use strict';
angular.module('user', [
  'ionic',
  'ngCordova',
  'ui.router',
  // Dependencies
  '_Mocifire'
]).config(function ($stateProvider) {

  $stateProvider.state('user', {
    abstract: true,
    url: '/user'
  });

  $stateProvider.state('register', {
    url: '/register',
    templateUrl: 'user/templates/register.html',
    controller: 'RegisterCtrl'
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'user/templates/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('profile', {
    url: '/profile',
    templateUrl: 'user/templates/profile.html',
    controller: 'ProfileCtrl'
  });
  
  //para el evento
  $stateProvider.state('main.profile', {
    url: '/profile/{:hide}',
    views: {
      eventView: {
        templateUrl: 'user/templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  //para la parte global de la aplicacion
  $stateProvider.state('global.profile', {
    url: '/profile/{:hide}',
    views: {
      globalView: {
        templateUrl: 'user/templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });  

});
