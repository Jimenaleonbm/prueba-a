'use strict';
angular.module('landing', [
    'ionic',
    'ngCordova',
    'ui.router'
    // TODO: load other modules selected during generation
])
    .config(function ($stateProvider) {
        $stateProvider.state('global', {
            url: '/global',
            abstract: true,
            templateUrl: 'landing/templates/menu.html',
            controller: 'MenuGlobalCtrl as ctrl',
            resolve: {
                menu: function (MainGlobal) {
                    return MainGlobal.getMenu();
                }
            }
        });
        // ROUTING with ui.router
        $stateProvider
        // this state is placed in the <ion-nav-view> in the index.html

            .state('global.landing', {
                url: '/landing',
                views: {
                    globalView: {
                        templateUrl: 'landing/templates/landing.html',
                        controller: 'LandingCtrl as ctrl'
                    }
                }

                //templateUrl: 'landing/templates/landing.html',
                //controller: 'LandingCtrl as ctrl'
            });
    });
