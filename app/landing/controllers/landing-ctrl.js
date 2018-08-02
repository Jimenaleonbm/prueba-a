'use strict';
angular.module('landing')
    .controller('LandingCtrl', function ($log, $scope, $mocifire, $commons, $filter, $user, $q, $CurrentSession, $state) {

        var ctrl = this;

        $scope.news = {
            loaded: false,
            empty: true,
            data: [],
            tpl: 'landing/templates/news.html'
        };
        $scope.events = {
            loaded: false,
            empty: true,
            data: [],
            tpl: 'landing/templates/events.html'
        };
        /**
         * Feed de noticias
         */
        var ref = firebase.database().ref('news');
        var query = ref.orderByChild('fecha').limitToLast(5);

        query.on('value', function (data) {
            $scope.news.data = $filter('orderBy')($filter('toArray')(data.val(), true), 'fecha', true);
            $commons.apply($scope);
        });

        /**
         * Actual y/o proximos eventos
         */
        var eventsRef = firebase.database().ref('active_events');
        var eventsQuery = eventsRef.limitToLast(8);

        eventsQuery.on('value', function (snapdata) {

            $scope.events.loaded = true;
            $scope.events.data = [];

            var data = snapdata.val();

            if (!data) return;

            angular.forEach(data, function (val, key) {
                $mocifire.get(['events', key, 'info']).then(function (data) {
                    if (!data) return;
                    data.$key = key;
                    data.order = new Date(data.dateFrom);
                    $scope.events.data.push(data);
                })
            })

        });

        $scope.getEventImage = function (img) {
            return (img) ? 'url('+img+')' : 'url(home/assets/images/bg-item-home.png)';
        };

        /**
         * enrutamientos
         */
        $scope.link = function (key) {
            if (!key) return;
            $state.go('main.home', {event_id: key});
        };

        $scope.link_externo = function (path) {
            if (!path) return;
            cordova.InAppBrowser.open(path, '_system', 'location=yes');
        };

    });
