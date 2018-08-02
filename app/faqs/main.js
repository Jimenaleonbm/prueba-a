'use strict';
angular.module('faqs', [
    'ionic',
    'ngCordova',
    'ui.router'
])
    .config(function ($stateProvider) {

        // ROUTING with ui.router
        $stateProvider.state('global.faqs', {
            url: '/faqs',
            views: {
                'globalView': {
                    templateUrl: 'faqs/templates/faqs.html',
                    controller: 'FaqsCtrl as ctrl'
                },           
            },
            params: {
                event_id: null
            }
        });
        // state de la seccion de faqs para eventos
        $stateProvider.state('global.faqsEvent', {
            url: '/faqs',
            views: {
                'globalView': {
                    templateUrl: 'faqs/templates/faqs-event.html',
                    controller: 'FaqsEventCtrl as ctrl'
                }
            }
        });
    });
