'use strict';
angular.module('surveys', [
  'ionic',
  'ngCordova',
  'ui.router',
  //Dependencies
  '_Mocifire',
]).config(function ($stateProvider) {

  $stateProvider.state('main.survey', {
    url: '/survey',
    views: {
      eventView: {
        templateUrl: 'surveys/templates/survey.html',
        controller: 'SurveyCtrl'
      }
    }
  });

});
