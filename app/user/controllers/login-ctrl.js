'use strict';
angular.module('user').controller('LoginCtrl', function ($scope, $user, $message, $state, _logo, Main, $ionicLoading, $ionicHistory) {

    $scope._register = Main.register;
    $scope.logo = _logo;

    $scope.loginWithFacebook = function () {
        $ionicLoading.show();
        $user.facebookLogin().then(function () {
            $ionicHistory.nextViewOptions({ disableBack: true });
            $state.go('profile').then($ionicLoading.hide);
        }).catch(function () {
            $ionicLoading.hide();
            $message.alert("Tuvimos problemas para acceder a tu cuenta, intentalo nuevamente");
        });
    };

    $scope.anonimo = function () {
        $ionicLoading.show();
        firebase.auth().signInAnonymously().then(function () {
            $state.go("global.landing").then(function () {
                $ionicHistory.nextViewOptions({ disableBack: true });
                $ionicLoading.hide();
            });
        }).catch(function(error) {
            // Handle Errors here.
            $ionicLoading.hide();
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    };

    $scope.login = function (email, password) {
        if (!email)
            return $message.alert("Por favor ingrese un email válido");
        else if (!password)
            return $message.alert("Por favor ingrese su contraseña");

        $ionicLoading.show();
        $user.login(email, password).then(function () {
            $state.go("global.landing").then(function () {
                $ionicHistory.nextViewOptions({ disableBack: true });
                $ionicLoading.hide();
            });
        }).catch(function (error) {
            $ionicLoading.hide();
            if (error.code == "auth/invalid-email")
                $message.alert("Por favor ingrese un email válido");
            else if (error.code == "auth/user-not-found" || error.code == "auth/wrong-password")
                $message.alert("El email o la contraseña son incorrectos, verifíquelos e intentelo nuevamente");
        });
    }

    $scope.forgotPassword = function () {
        $message.prompt("Recuperar contraseña", "Por favor ingresa tu e-mail y te enviaremos un correo para restablecer los datos de usuario", "Aceptar", "Cancelar").then(function (email) {
            if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(email))
                return $message.alert("El correo electrónico es inválido");

            $user.forgotPassword(email).then(function () {
                $message.popup("Email enviado", "Hemos enviado un mail a tu correo electrónico con instrucciones, para que puedas restablecer tu contraseña");
            }).catch(function () {
                $message.alert("El correo electrónico es inválido o no existe, verifiquelo e intentelo nuevamente,");
            });
        });
    }

    $scope.changePassword = function (password) {
        $user.changePassword(password).then(function () {
            console.info("OK");
        }).catch(function (error) {
            if (error.code == "auth/weak-password") {
                $message.alert("La contraseña es muy débil, debe tener mínimo 6 caracteres");
            }
        });
    }

});
