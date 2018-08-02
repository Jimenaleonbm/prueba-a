'use strict';
var net = angular.module('networking');

net.controller('CardCtrl', function ($log, $scope, $state, $user, $ionicPopup, $cordovaBarcodeScanner, $Contact, $message, $firebaseObject, $q, $ionicHistory) {

	var ctrl = this;

	ctrl.goHome = function() {
		$state.go('main.agenda');
		$ionicHistory.clearHistory();
	};

	$log.log('user id:', $user.uid);

	$scope.user = {};
	$scope.userid = $user.uid;
	$scope.size = 250;

	$Contact.getUser($scope.userid).then(function (data) {
		$scope.user = data;
	});

	$scope.scan = function() {
		$cordovaBarcodeScanner.scan().then(function(data) {

			$log.log('Dato leido por QR:', data);

			if (!data || data.text == '') return;

			$Contact.acceptRequest($scope.user, data.text).then(function () {
				// success
				$message.alert('Usuario agregado a tu lista de contactos');
			});

		});
	};

	ctrl.showInstruction = function () {
		$ionicPopup.alert({
			title: 'Cómo agregar contactos',
			template: '<div class="fw-400 font-small">1. Abre el lector de codigo QR, haciendo click en el icono de la parte superior derecha.<br><br>2. Escanea el codigo QR de otro usuario.<br><br>3. Una vez hecho el scan, los contactos se compatirán automaticamente.</div>',
			buttons: [
				{
					text: 'Ok',
					type: 'button-dark'
				}
			]
		});
	};

	ctrl.go = function (state, params) {
    $state.go(state, params);
  }

});
