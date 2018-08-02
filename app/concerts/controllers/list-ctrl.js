'use strict';
angular.module('concerts').controller('ConcertsCtrl', function ($scope, $mocifire, $state) {

    /**
     * Objecto de configuracion
     * @type {{loaded: boolean, empty: boolean, data: Array, tpl: string}}
     */
    $scope.events = {
        loaded: false,
        empty: true,
        data: [],
        tpl: 'landing/templates/events.html'
    };

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
