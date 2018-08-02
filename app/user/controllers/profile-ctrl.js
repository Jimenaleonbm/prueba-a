'use strict';
angular.module('user').controller('ProfileCtrl', function ($scope, $user, $message, $state, $mocifire, $stateParams, $log, $ionicLoading, $timeout, $q, $filter, $camera, $profileimage) {

    $ionicLoading.show();

    var hideloader = function () {
        $timeout($ionicLoading.hide, 500);
    };

    $scope.tpl = {
        form: 'user/templates/profile-form.html'
    };

    $scope.hideButton = {
        val: $stateParams.hide
    };

    $scope.form = {};
    $scope.image = {};

    /**
     * Camara
     */
    $scope.changeImage = function (library) {
        $camera.get(library).then(function (blop) {
            $scope.image.change = true;
            $scope.image.blop = blop;
            $scope.image.url = URL.createObjectURL(blop);
        });
    };

    /**
     * init promesa
     */
    var promesas = {};

    promesas.dos = $mocifire.get(['users', $user.uid, 'info']).then(function (info) {
        if (info.birthday) info.birthday = new Date(info.birthday);
        $scope.form = info;
        $scope.image.url = info.image || null;
    });

    /**
     * push
     */
    $scope.push_form = {};
    var push_status = firebase.database().ref('users').child($user.uid).child('push').child('disabled');
    push_status.once('value', function (dato) {
       $scope.push_form.value = dato.val();
    });

    /**
     * resolver promesa
     */
    $q.all(promesas).then(function () {
        hideloader();
    }).catch(function (err) {
        $log.log('error', err);
        hideloader();
    });

    /**
     * Acciones
     */
    $scope.save = function (form) {

        if ($scope.image.change && $scope.image.blop)
            $profileimage.update($scope.image.blop);

        $user.saveProfile({
            name: (form.name) ? form.name : null,
            birthday: (form.birthday) ? form.birthday.getTime() : null,
            dni: (form.dni) ? form.dni : null,
            mobilePhone: (form.mobilePhone) ? form.mobilePhone : null,
            company: (form.company) ? form.company : null,
            title: (form.title) ? form.title : null,
            country: (form.country) ? form.country : null,
            city: (form.city) ? form.city: null,
            email: (form.email) ? form.email : null,
        }).then(function () {
            $message.alert("Tus datos se han guardado exitosamente");
            if (!$scope.hideButton.val)
                $state.go('global.landing');
        }).catch(function () {
            $message.alert("Tuvimos problemas al guardar tus datos, intentalo nuevamente.");
        });
    };

    $scope.save_push_status = function () {
        push_status.set($scope.push_form.value);
    };

    $scope.later = function () {
        $state.go('global.landing');
    };

});
