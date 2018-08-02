'use strict';
angular.module('networking')
    .controller('AttendeesCtrl', function ($scope, $log, $mocifire, $state, $ionicHistory, $ionicLoading, $Contact, $q, $timeout, $user, $http, $message) {

        var ctrl = this;

        $scope.search = {};
        /**
         * Datos de usuario actual
         */
        ctrl.user = $user.uid;
        ctrl.fbuserid = ctrl.user;

        /**
         * Attendees
         * @type {{cache: Array, data: Array}}
         */
        ctrl.attendees = {
            cache: [],
            data: []
        };

        /**
         * traer usuarios del evento actual
         */
        var usersRef = firebase.database().ref('users');

        usersRef.on('child_added', function (user) {
            // Get id
            var user_id = user.getKey();
            // Revisar si el usuario es el actual
            if (user_id === $user.uid) return;
            // Three way data binding
            $Contact.getUser(user_id).then(function (on_user) {
                on_user.id = user_id;
                ctrl.attendees.data.push(on_user);
            });
        });

        /**
         * Enviar solicitud de contacto (business card exchange)
         */
        ctrl.request = function (receiverID, check, index) {

            // retornar si esta en proceso de aprobacion
            if (check === false) return;

            $Contact.request(receiverID).then(function () {
                $log.log('request success');
                $message.alert('Solicitud enviada.');
            }).catch(function (err) {
                $log.log('request error:', err);
            })
        };

    });
