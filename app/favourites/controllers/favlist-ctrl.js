'use strict';
angular.module('favourites')
    .controller('FavlistCtrl', function ($log, $scope, $mocifire, $fav, $CurrentSession, $state, $filter) {

        var ctrl = this;
        ctrl.favourites = $fav.list;

        ctrl.tpl = {teaser: 'agenda/templates/teaser.html'};

        if (!ctrl.favourites) return;

        angular.forEach(ctrl.favourites.programme, function (session, key) {

            if (session === null)
                return delete ctrl.favourites.programme[key];

            session.$id = key;

            // Toca pasar la hora de inicio de string a Integer, de no ser asi el ordenamiento por HORA no funciona como se espera
            if (session.info.hourFrom && session.info.hourFrom.hour && session.info.hourFrom.minutes)
                session.info.startInteger = parseInt(session.info.hourFrom.hour + session.info.hourFrom.minutes);

        }); //**** end forEach

        ctrl.favouritesLength = $filter('toArray')(ctrl.favourites.programme);
        ctrl.favouritesProgramme = $filter('groupBy')($filter('orderBy')(ctrl.favouritesLength, 'info.startInteger'), 'info.date');

        /**
         * events
         */
        $scope.events = {
            teaser: 'landing/templates/events.html',
            data: $filter('toArray')(ctrl.favourites.events, true)
        };

        console.log('length', $scope.events.length);

        $scope.link = function (id) {
            if (!id) return;
            $state.go('main.home', {event_id: id});
        };

        $scope.getEventImage = function (img) {
            return (img) ? 'url('+img+')' : 'url(home/assets/images/bg-item-home.png)';
        };

        $scope.link_externo = function (path) {
            if (!path) return;
            cordova.InAppBrowser.open(path, '_system', 'location=yes');
        };

        /**
         * speakers
         */
        angular.forEach(ctrl.favourites.speakers, function (speaker, key) {
            speaker.$id = key;
        }); //**** end forEach

        ctrl.favouritesSpeakers = $filter('toArray')(ctrl.favourites.speakers);

        /**
         * MANEJO DE DATOS PARA TIPOS DE SESION
         */
        $mocifire.get(['sessiontypes']).then(function (data) {
            ctrl.sessiontypes = data;
        });

        /**
         * MANEJO DE DATOS PARA ESCENARIOS
         */
        $mocifire.get(['scenarios']).then(function (data) {
            ctrl.scenarios = data;
        });

        /**
         * Enrutamiento: al ahcer click en una sesion
         */
        ctrl.ir = function (session) {

            var scenario = (ctrl.scenarios && ctrl.scenarios[session.info.place]) ? ctrl.scenarios[session.info.place].name : null;
            var type = (ctrl.sessiontypes && ctrl.sessiontypes[session.info.type]) ? ctrl.sessiontypes[session.info.type].name : null;
            var track = (ctrl.tracks && ctrl.tracks[session.info.track]) ? ctrl.tracks[session.info.track].name : null;

            // pasar datos de sesion seleccionada para usarlos en el detalle
            $CurrentSession.set(session, scenario, type, track);
            $state.go('main.session', {event_id: session.event_id,  sessionid: session.$id});
        };

        //tabs acordeon logic
        ctrl.itemSelected = {};

        ctrl.selectItem = function (id) {
            ctrl.itemSelected[id] = !ctrl.itemSelected[id];
        };

        ctrl.checkItem = function (check) {
            return ctrl.itemSelected[check] === true;
        };

    });
