'use strict';
angular.module('livestream', [
    'ionic',
    'ngCordova',
    'ui.router',
]).config(function ($stateProvider) {

    $stateProvider.state('global.livestream', {
        url: '/livestream/',
        params: {
            streaming: {}
        },
        views: {
            globalView: {
                templateUrl: 'livestream/templates/stream.html',
                controller: 'StreamCtrl'
            }
        }
    });

    $stateProvider.state('global.livestreamList', {
        url: '/livestream-list',
        views: {
            globalView: {
                templateUrl: 'livestream/templates/stream-list.html',
                controller: 'StreamListCtrl'
            }
        }
    });

});
