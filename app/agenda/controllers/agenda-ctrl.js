'use strict';
angular.module('agenda')
    .controller('AgendaCtrl', function ($log, $scope, $mocifire, $filter, $state, $CurrentSession, $FilterRules, $fav, $ionicLoading, $timeout, $groupby, $location, $ionicScrollDelegate, event_id) {


        $ionicLoading.show();

        var ctrl = this;

        ctrl.TheTime = {};

        $scope.$on('$ionicView.enter', function () {
            ctrl.TheTime.day = $filter('date')(new Date(), 'MMM d, yyyy');
            ctrl.TheTime.hour = parseInt($filter('date')(new Date(), 'Hmm'));
        });

        /**
         * Settings
         */
        var updateScroll = function () {
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop();
        };

        /**
         * Filtro
         */
        ctrl.filter = $FilterRules;

        ctrl.fTab = 'tracks';
        ctrl.fSelect = function (key) {
            ctrl.fTab = key;
        };
        ctrl.fIsSelected = function (key) {
            return ctrl.fTab === key;
        };

        /**
         * Tabs secundarios - de agrupacion
         */
        ctrl.groupby = $groupby;

        /**
         * init favoritos
         */
        $fav.init();

        /**
         * templates
         */
        ctrl.tpl = {
            teaser: 'agenda/templates/teaser.html',
            filter: 'agenda/templates/filter-agenda.html'
        };

        /**
         * View title
         */
        ctrl.title = {
            value: 'AGENDA',
            istype: false
        };

        /**
         * Settings - vars
         */
        ctrl.settings = {};
        ctrl.days = {};

        /**
         * Reglas para Filtro
         */
        ctrl.rules = $FilterRules;

        /**
         * FUNCIONALIDAD DE LOS TABS (DIAS)
         */
        //definir tab activo por defecto
        ctrl.settings.panel = null;
        //fn: activa el panel seleccionado
        ctrl.selectPanel = function (selected) {
            ctrl.settings.panel = selected;
            updateScroll();
        };
        //fn: valida si el panel esta activo: bolean
        ctrl.isSelected = function (check) {
            return ctrl.settings.panel === check;
        };

        /**
         * switch: filtro por hora y escenario
         */
        ctrl.settings.sort = ctrl.settings.sort || false;

        ctrl.setFilter = function (val) {
            ctrl.settings.sort = val;
        };

        /**
         * MANEJO DE DATOS PARA AGENDA
         */
        ctrl.agenda = ctrl.agenda || [];
        var agenda = [];

        function OrdenarAgenda() {
            $mocifire.get('programme').then(function (data) {

                angular.forEach(data, function (session, key) {

                    if (session.info.date) {
                        var day = parseInt($filter('date')(new Date(session.info.date), 'd'));
                        //console.log('day',day);
                        var ref = firebase.database().ref('programme').child(key);
                        ref.setPriority(day);
                        //ref.save();
                        console.log('ref', ref);
                    }
                })
            });
        }


        $mocifire.get(['programme', event_id]).then(function (data) {

            if (!data) return $timeout($ionicLoading.hide, 500);

            data = $filter('checkHour')($filter('toArray')(data, true));

            angular.forEach(data, function (session) {

                // Set: Dia
                var day = {
                    name: session.info.date, // Nombre para mostrar
                    value: new Date(session.info.date) // objeto fecha para configuracion
                };

                // Toca pasar la hora de inicio de string a Integer, de no ser asi el ordenamiento por HORA no funciona como se espera
                if (session.info.hourFrom && session.info.hourFrom.hour && session.info.hourFrom.minutes)
                    session.info.startInteger = parseInt(session.info.hourFrom.hour + session.info.hourFrom.minutes);

                if (session.info.hourTo && session.info.hourTo.hour && session.info.hourTo.minutes)
                    session.info.endInteger = parseInt(session.info.hourTo.hour + session.info.hourTo.minutes);

                // Crear tabs de dias
                ctrl.days[day.name] = day;

                // Agregar session al arreglo
                agenda.push(session);

                $timeout($ionicLoading.hide, 500);

            }); //**** end forEach

            ctrl.init();

            /**
             * Logica para activar tab de dia
             * si aun es el evento saldra activo por defecto el primer dia del evento.
             */
            var defaultDay = ctrl.days[Object.keys(ctrl.days)[0]].name;
            ctrl.settings.panel = ctrl.settings.panel || asignarTabActivo(ctrl.days, defaultDay);

        }); // End get sessions

        /**
         * Con este metodo inicializamos el array para aplicar los filtros requeridos
         */
        ctrl.init = function (toggleFilter) {
            var agendaFilter = $filter('filteragenda')(agenda);
            var agendaOrder = $filter('orderBy')(agendaFilter, 'info.startInteger');
            ctrl.agenda = $filter('groupBy')(agendaOrder, 'info.date');
            $scope.agenda = ctrl.agenda;
            updateScroll();
            
            if (toggleFilter)
                ctrl.filter.toggle();
        };

        /**
         * MANEJO DE DATOS PARA TIPOS DE SESION
         */
        $mocifire.get(['sessiontypes']).then(function (data) {
            ctrl.sessiontypes = data;
        });

        ctrl.getType = function (id) {
            return ctrl.sessiontypes[id].name;
        };

        /**
         * MANEJO DE DATOS PARA ESCENARIOS
         */
        $mocifire.get(['scenarios', event_id]).then(function (data) {
            ctrl.scenarios = data;
        });

        /**
         * MANEJO DE DATOS PARA TRACKS
         */
        $mocifire.get(['tracks']).then(function (data) {
            ctrl.tracks = data;
        });

        ctrl.getTrack = function (id) {
            return ctrl.tracks[id].name;
        };

        /**
         * Enrutamiento: al ahcer click en una sesion
         */
        ctrl.ir = function (session) {

            var scenario = (ctrl.scenarios && ctrl.scenarios[session.info.place]) ? ctrl.scenarios[session.info.place].name : null;
            var type = (ctrl.scenarios && ctrl.sessiontypes[session.info.type]) ? ctrl.sessiontypes[session.info.type].name : null;
            var track = (ctrl.tracks && ctrl.tracks[session.info.track]) ? ctrl.tracks[session.info.track].name : null;

            // pasar datos de sesion seleccionada para usarlos en el detalle
            $CurrentSession.set(session, scenario, type, track);
            $state.go('main.session', {sessionid: session.$key});
        };

        /**
         * METODO PARA SELECCINAR EL TAB ACTIVO PARA EL DIA
         */
        var asignarTabActivo = function (dias, diaPorDefecto) {

            var diaActivo = null,
                diahoy = $filter('date')(new Date(), 'MMM d');

            angular.forEach(dias, function (dia) {

                if (dia.name === diahoy)
                    diaActivo = dia.name;

            });

            if (diaActivo === null)
                diaActivo = diaPorDefecto;

            return diaActivo;
        };

        /**
         * ScrollTo por id
         */
        $scope.goTo = function (id) {
            $location.hash(id);
            $ionicScrollDelegate.anchorScroll();
        };

        /**
         * Metodo para sesion activa
         */
        ctrl.sessionActive = function (session) {
            return ctrl.TheTime.day == session.info.date && ctrl.TheTime.hour > session.info.startInteger && ctrl.TheTime.hour < session.info.endInteger
        };

        /**
         * Metodos para acoordion activo
         */
        ctrl.acordionSelected = {};

        ctrl.selectAcordion = function (key) {
            ctrl.acordionSelected[key] = !ctrl.acordionSelected[key];
            $ionicScrollDelegate.resize();
        };

        ctrl.isAcordionSelected = function (key) {
            return ctrl.acordionSelected[key];
        };

    });
