'use strict';
angular.module('news', [
    'ionic',
    'ngCordova',
    'ui.router',
    // TODO: load other modules selected during generation
])
    .config(function ($stateProvider) {

        // ROUTING with ui.router
        $stateProvider.state('global.news', {
            abstract: true,
            url: '/news',
            views: {
                globalView: {
                    templateUrl: 'news/templates/index.html'
                }
            }
        });

        $stateProvider.state('global.news.list', {
            url: '/list',
            views: {
                news: {
                    templateUrl: 'news/templates/news.html',
                    controller: 'NewsCtrl'
                }
            }
        });

        $stateProvider.state('global.news.detail', {
            url: '/detail',
            views: {
                news: {
                    templateUrl: 'news/templates/notice.html',
                    controller: 'NoticeCtrl'
                }
            },
            params: {
                notice: null
            }
        });

        // ROUTING with ui.router
        $stateProvider.state('global.news.push', {
            url: '/push',
            views: {
                push: {
                    templateUrl: 'news/templates/push.html',
                    controller: 'PushCtrl'
                }
            }
        })

    });
