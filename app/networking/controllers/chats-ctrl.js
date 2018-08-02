'use strict';
var _chats = angular.module('networking');

_chats.controller('ChatsCtrl', function ($log, $ionicHistory, $state, $firebaseObject, $Contact, $mocifire, $ionicLoading, $user, $q, $timeout) {

  var ctrl = this;
  // Boton ir al home
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
  */
  ctrl.user = $user.uid;

  ctrl.fireUser = {};

  /**
  * CREAR DATA BINDING PARA USUARIOS
  * 1. Usuario actual: sender
  * 2. Usuario destinatario: receiver
  */
  $Contact.getUser(ctrl.user).then(function (user) {

    ctrl.fireUser = user;

    // init chats
    ctrl.fireUser.chats = ctrl.fireUser.chats || {init:true};
    ctrl.fireUser.$save();

    // Revisar que el usuario tiene chats
    if (!user.chats) return hideLoader();

    var promises = [];
    var chats = [];

    // Watch: ver si se agrega un nuevo chat
    var chatsREF = firebase.database().ref('users').child(ctrl.user).child('chats');

    chatsREF.on('child_added', function (snap) {
      var newUser = snap.val();
      if ( typeof newUser === 'object') {
        $mocifire.get('users/' + newUser.id).then(function (contact) {
          contact.id = newUser.id;
          ctrl.chats.push(contact);
        });
      }
    });

    $q.all(promises).then(function () {
      ctrl.chats = chats;
      hideLoader();
    });

  });

  ctrl.checkMessage = function (id) {
    var result = (ctrl.fireUser.chats && ctrl.fireUser.chats[id].unread) ? true : false;
    return result;
  };

  ctrl.fireUserData = function (id) {
    var data = (ctrl.fireUser.chats && ctrl.fireUser.chats[id] && ctrl.fireUser.chats[id].lastmessage) ? ctrl.fireUser.chats[id] : '';
    return data;
  };

  ctrl.orderByTimestamp = function (chat) {
    return ctrl.fireUserData(chat.id).timestamp;
  };

  /**
  * Opt in & opt out
  */
  ctrl.opt = function () {

    if (angular.isDefined(ctrl.fireUser.optout)) {
      ctrl.fireUser.optout = !ctrl.fireUser.optout;
    } else {
      ctrl.fireUser.optout = true;
    }
    ctrl.fireUser.$save();

  };

});
