'use strict';
angular.module('favourites', [
    'ionic',
    'ngCordova',
    'ui.router'
])
    .config(function ($stateProvider) {

        // ROUTING with ui.router
        $stateProvider.state('main.favourites', {
            url: '/favourites',
            views: {
                'eventView': {
                    templateUrl: 'favourites/templates/favlist.html',
                    controller: 'FavlistCtrl as ctrl'
                }
            }
        });
        // ROUTING with ui.router
        $stateProvider.state('global.favourites', {
            url: '/favourites',
            views: {
                'globalView': {
                    templateUrl: 'favourites/templates/favlist.html',
                    controller: 'FavlistCtrl as ctrl'
                }
            }
        });
    });
