'use strict';
angular.module('main', [
    'ionic',
    'ngCordova',
    'ui.router'
    // TODO: load other modules selected during generation
]).config(function ($stateProvider, $ionicConfigProvider) {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }

    /**
     * Disable swipe back
     */
    $ionicConfigProvider.views.swipeBackEnabled(false);
    /**
     * Back button config
     */
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText(false).text('');

    $stateProvider.state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/templates/menu.html',
        controller: 'MenuCtrl as ctrl',
        resolve: {
            event_id: ['$stateParams', function ($stateParams) {
                return $stateParams.event_id;
            }],
            menu: function (Main) {
                return Main.getMenu();
            }
        },
        cache: false,
        params: {
            event_id: null
        }
    });

}).run(function ($state, $ionicPlatform, $push, $user, $fav, $rootScope, _states, Main, $ionicLoading) {
 
    $ionicPlatform.ready(function () {

        var networkConnected = true;

        window.addEventListener('online', function() {
            console.log('onNetworkOnline');
            if (networkConnected) return;
            networkConnected = true;
            $ionicLoading.hide();
            $rootScope.$broadcast('networkonline');
        });
            
        window.addEventListener('offline', function() {
            console.log('esto se gue')
            if (!networkConnected) return;

            networkConnected = false;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner> <br/> Por favor revisa tu conexión'
            })
            $rootScope.$broadcast('networkoffline');
        });

        function hideSplash() {
            if (ionic.Platform.platform() == "ios")
                navigator.splashscreen.hide();
            else if (navigator.splashscreen) {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 1000);
            }
        }

        function getAuth() {
            $user.getAuth().then(function () {
                $fav.init();
                $state.go("global.landing").then(hideSplash);
            }).catch(function () {
                $state.go("login").then(hideSplash);
            });
        }

        console.log('ola q ase');

        function INIT() {
            /**
             * init push notifications
             */
            $push.init();
            /**
             * se traen configuracion del evento:
             * 1. inicializa google UA
             * 2. revisa si tiene seccion de registro
             */
            Main.initSettings().then(function () {
                /**
                 * estado de atenticacion del usuario
                 */
                getAuth();
            }).catch(function () {
                /**
                 * estado de atenticacion del usuario
                 */
                getAuth();
            });
        }

        INIT();

    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!window.ga) return;
        window.ga.trackView(_states[toState.url.split('/')[1]]);
    });

}).filter('trustAsHTML', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]).constant("_states", {
    "home": "Pantalla Principal",
    "favourites": "Favoritos",
    "agenda": "Agenda",
    "livestream-list": "Live Streaming",
    "speakers": "Conferencistas",
    "sponsors": "Patrocinadores",
    "venue": "Lugar del Evento",
    "list": "Noticias",
    "twitter": "Twitter",
    "card": "Networking",
    "tracks": "Tracks",
    "survey": "Encuestas",
    "chats": "Chats"
}).constant('_logo', {
    white: 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2275%22%20height%3D%2250%22%20viewBox%3D%220%200%2075%2050%22%3E%3Cg%20fill%3D%22%23fff%22%3E%3Cpath%20d%3D%22M13.6%2042c.9%200%201.5%200%202.3.3.7.4%201.1.8%201.1%201.5%200%20.9-.7%201.3-1.7%201.5%201.4.1%202.3%201%202.3%202%200%20.7-.4%201.4-1.1%201.8-.9.6-1.7.6-2.9.6H8.8c.8-.4.7-1%20.7-1.7v-4.4c0-.6.1-1.3-.7-1.6h4.8zm-1.4%203.1h.6c.8%200%201.2-.6%201.2-1.1%200-.5-.3-.9-1-.9-.2%200-.6%200-.8.1v1.9zm0%203.5c.2.1.7.1%201%20.1%201%200%201.5-.6%201.5-1.3%200-.9-.6-1.3-1.8-1.3h-.7v2.5zM20.4%2047.5l-.4.8c-.1.2-.2.6-.2.9%200%20.3.2.5.5.7h-2.8c.5-.4.7-.8%201-1.4l1.9-4.7c.1-.2.3-.7.3-1%200-.3-.2-.5-.5-.7h3.4l2.6%206.1c.3.8.4%201%201.2%201.7h-4.2c.3-.2.6-.3.6-.7%200-.2%200-.3-.1-.4l-.5-1.2-2.8-.1zm1.3-3.5l-.9%202.3h1.9l-1-2.3zM28.8%2050L26%2043.1c-.2-.4-.3-.7-.7-1h3.1v.1c0%20.3.3%201%20.4%201.3l1.7%204.4%201.6-4.3c.1-.2.2-.5.2-.7%200-.4-.3-.6-.6-.8h2.5L31.1%2050h-2.3zM35.9%2047.5l-.3.8c-.1.2-.2.6-.2.9%200%20.3.2.5.5.7H33c.5-.4.7-.8%201-1.4l1.9-4.7c.1-.2.3-.7.3-1%200-.3-.2-.5-.5-.7H39l2.6%206.1c.3.8.4%201%201.2%201.7h-4.2c.3-.2.6-.3.6-.7%200-.2%200-.3-.1-.4l-.5-1.2-2.7-.1zm1.4-3.5l-.9%202.3h1.9l-1-2.3zM46.4%2048.1c0%20.6-.1%201.3.6%201.7h-3.7c.7-.4.6-1%20.6-1.7v-4.4c0-.6.1-1.3-.6-1.7h4.1c.7%200%201.2%200%201.8.3.8.4%201.2%201%201.2%201.8%200%20.9-.7%201.5-1.6%201.9l1.6%202.4c.4.5.8%201%201.3%201.4l-1.9.1c-.9%200-1.4-.1-1.8-.8l-1.6-2.6v1.6zm0-4.9v2.7c.9-.1%201.5-.8%201.5-1.5%200-.4-.2-.8-.6-1-.2-.1-.5-.2-.8-.2h-.1zM55.3%2048.2c0%20.6-.1%201.3.6%201.6h-3.7c.7-.4.6-1%20.6-1.6v-4.4c0-.6.1-1.3-.6-1.7h3.7c-.7.4-.6%201-.6%201.7v4.4zM59.4%2047.5l-.4.8c-.1.2-.2.6-.2.9%200%20.3.2.5.5.7h-2.8c.5-.4.7-.8%201-1.4l1.9-4.7c.1-.2.3-.7.3-1%200-.3-.2-.5-.5-.7h3.4l2.6%206.1c.3.8.4%201%201.2%201.7h-4.2c.3-.2.6-.3.6-.7%200-.2%200-.3-.1-.4l-.5-1.2-2.8-.1zm1.3-3.5l-.9%202.3h1.9l-1-2.3zM52.2%2024c.5-.2%205.8-2%205.8-4.6%200-3.6-11.6-6.9-11.6-6.9l-9.5%204.6c-3.4-2.2-7.2-3.8-11.3-4.6l-12.4%206.3c4.2%200%208.2%201.3%2011.4%203.6v12.3c-3.5%201.6-7.3%202.5-11.4%202.5v.4h32.4c10.1%200%2015-4%2015-6.3.2-2.3-1.9-4.6-8.4-7.3zM37%2018.8s7.7.7%207.7%204.1c0%202.6-7.7%203.6-7.7%203.6v-7.7zm0%2016.7v-7.7s10.8%201.7%2010.8%206.1c0%204.3-10.8%201.6-10.8%201.6zM41.3%209.7l-.9-8.4h.1c.5%200%20.9-.4.9-.9V0h-8c-.6%200-1%20.4-1.1%201H31c-.5%200-1%20.5-1%201.1V5c0-.6.4-1%201-1h2l.6.6H31V5c0%20.6.4%201%201%201h1.5L33%209.5c-.2%201.3-1.3%202.4-2.7%202.4-.5%200-1-.1-1.4-.4%201.3%201.1%203%201.7%204.8%201.7%201.1%200%202.5-.4%203.2-.7.7.3%202%20.7%203.2.7%201.8%200%203.5-.6%204.8-1.7-.3.2-.7.3-1.1.3-1.2%200-2.3-1-2.5-2.1zm-6.4-6.8c-.5%200-.9-.4-.9-.9h1.8c.1.5-.4.9-.9.9zm10%208.6z%22/%3E%3C/g%3E%3C/svg%3E'
});
