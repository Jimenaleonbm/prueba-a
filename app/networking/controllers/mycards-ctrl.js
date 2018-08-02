'use strict';
var crds = angular.module('networking');

crds.controller('MycardsCtrl', function ($log, $q, $scope, $user, $mocifire, $Contact, $state, $ionicHistory, $ionicLoading, $timeout) {

  var ctrl = this;

  ctrl.goHome = function() {
    $state.go('main.agenda');
    $ionicHistory.clearHistory();
  };

  // Mostrar cargador mientras se resuelven las promesas
  $ionicLoading.show();

  // metodo para ocultar loader
  var hideLoader = function () {
    // Timeout para evitar bug de ionic que a veces se congela e loader
    $timeout(function () {
      $ionicLoading.hide();
    }, 500);
  };

  /**
  * 1. user: usuario actual
  * 2. fireuser: datos de usuario actual en firebase
  */
  ctrl.user = $user.uid;
  ctrl.fireUser = null;

  /**
  * Query: buscar usuarios a los que se les han enviado solicitudes
  */
  var usersRef = firebase.database().ref('users');
  usersRef.orderByChild('requests/' + $user.uid + '/status').equalTo(false).on('value', function (snapshot) {
    ctrl.sentRequests = [];
    angular.forEach(snapshot.val(), function (val, key) {
      val.id = key;
      ctrl.sentRequests.push(val);
    });
  });

  /**
  * CREAR DATA BINDING PARA USUARIOS
  * 1. Usuario actual: sender
  * 2. Usuario destinatario: receiver
  */
  $Contact.getUser(ctrl.user).then(function (user) {
    ctrl.fireUser = user;

    // init notification
    ctrl.fireUser.notifications = ctrl.fireUser.notifications || {};
    ctrl.fireUser.notifications.request = false;

    $scope.$watch(function (scope) {

      return ( ctrl.fireUser.notifications.request );

    }, function handleChange( newValue, oldValue ) {

      ctrl.fireUser.notifications.request = false;
      ctrl.fireUser.$save();

    });

    // init requests
    ctrl.fireUser.requests = ctrl.fireUser.requests || { init:true };
    ctrl.fireUser.$save();

    // init local arrays
    ctrl.requests = [];
    ctrl.cards = [];

    // Watch: ver si se agrega un nuevo request
    var requestsREF = firebase.database().ref('users').child(ctrl.user).child('requests');

    requestsREF.on('child_added', function (snap) {

      // Handle result
      var newRequest = snap.val();

      if ( typeof newRequest !== 'object') {
        return hideLoader();
      }

      $mocifire.get('users/' + newRequest.id + '/info').then(function (contact) {
        
        contact.id = newRequest.id;

        if (!newRequest.status) {
          // requests
          ctrl.requests.push(contact);
        } else {
          // contacts
          ctrl.cards.push(contact);
        }
        hideLoader();
      });

    });// end on('child_added')

  });

  /**
  * metodo para ver si el usuario tiene una accion en progreso
  */
  var inprogress = null;

  ctrl.inprogress = function(id) {
    return inprogress === id;
  };

  ctrl.setprogress = function(id) {
    inprogress = id;
  };

  /**
  * Ignorar solicitud
  */
  ctrl.ignore = function (id, index) {
    ctrl.setprogress(id);
    $Contact.ignoreRequest(ctrl.fireUser, id).then(function () {
      // success
      ctrl.requests.splice(index, 1);
      ctrl.setprogress(null);
    }).catch(function (err) {
      // error
      $log.log('ignore request error:', err);
    });
  };

  /**
  * Aceptar solicitud
  */
  ctrl.accept = function (id, index) {

    //return $log.log('requester id:', id);

    ctrl.setprogress(id);
    $Contact.acceptRequest(ctrl.fireUser, id).then(function () {
      // success
      ctrl.cards.push(ctrl.requests[index]);
      ctrl.requests.splice(index, 1);
      ctrl.setprogress(null);
    });
  };

});
