'use strict';
angular.module('user').controller('RegisterCtrl', function ($scope, $user, $message, $state, $ionicHistory, $ionicLoading, $timeout, _logo) {

    $scope.logo = _logo;

    $scope.loginWithFacebook = function () {
        $ionicLoading.show();
        $user.facebookLogin().then(function () {
            $timeout(function () {
                $ionicLoading.hide();
                $state.go('profile');
            }, 200);
        }).catch(function () {
            $ionicLoading.hide();
            $message.alert("Tuvimos problemas para acceder a tu cuenta, intentalo nuevamente");
        });
    };

    $scope.registrar = function (name, email, password) {
        if (!name) {
            $message.alert("Por favor ingrese su nombre");
        } else if (name.split(" ").length < 2) {
            $message.alert("El nombre debe tener Nombre y Apellido");
        } else if (!email) {
            $message.alert("Debe ingresar un correo electrónico válido");
        } else if (!password) {
            $message.alert("Debe ingresar una contraseña");
        } else if (password.split("").length < 6) {
            $message.alert("La contraseña debe tener mínimo seis caracteres");
        } else {
            $ionicLoading.show();
            $user.register(email, password, name).then(function () {
                $ionicHistory.nextViewOptions({disableBack: true});
                $state.go("global.landing").then(function () {
                    $ionicLoading.hide();
                });
            }).catch(function (error) {
                $ionicLoading.hide();
                if (error.code == "auth/email-already-in-use") {
                    $message.alert("El correo electrónico ya está en uso");
                } else if (error.code == "auth/weak-password") {
                    $message.alert("La contraseña es muy débil");
                }
            });
        }
    }

});
