'use strict';
var _chat = angular.module('networking');
_chat.controller('ChatCtrl', function ($q, $log, $scope, $mocifire, $Contact, $user, $stateParams, $ionicLoading, $timeout, $firebaseArray, $ionicScrollDelegate, $push) {

  var ctrl = this, promises = {};

  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

  // Mostrar cargador mientras se resuelven las promesas
  $ionicLoading.show();

  // metodo para ocultar loader
  var hideLoader = function () {
    // Timeout para evitar bug de ionic que a veces se congela e loader
    $timeout(function () {
      $ionicLoading.hide();
    }, 500);
  };

  // ScrollBottom
  var scrollBottom = function () {
    $timeout(function() {
      viewScroll.scrollBottom(true);
    }, 0);
  };

  /**
  * 1. user: usuario actual
  * 2. receiverID: id que se pasa como parametro de la ruta
  */
  ctrl.sender = null;
  ctrl.user = $user.uid;
  ctrl.receiverID = $stateParams.chatID;

  /**
  * Crear Id unico para chat:
  * uniendo el id tanto del remitente como del destinatario
  */
  var chatIdParams = [ctrl.receiverID, ctrl.user];
  ctrl.generarChatId = chatIdParams.sort().join('');

  /**
  * RETRIEVING DATA - FROM TFI
  * Traer datos de usuario RECEIVER de la plataforma de TFI,
  * 2. Usuario destinatario: receiver
  */
  promises.one = $mocifire.get('users/' + ctrl.receiverID + '/info').then(function (contact) {
    ctrl.receiver = contact;
  });

  /**
  * CREAR DATA BINDING PARA USUARIOS
  * 1. Usuario actual: sender
  * 2. Usuario destinatario: receiver
  */
  promises.two = $Contact.getUser(ctrl.user).then(function (user) {
    ctrl.sender = user;

    if (!(ctrl.sender && ctrl.sender.chats && ctrl.sender.chats[ctrl.receiverID])) return;

    // Menejar el cambio en la variable "unread" del usuario
    $scope.$watch(function (scope) {

      return ( ctrl.sender.chats[ctrl.receiverID].unread );

    }, function handleChange( newValue, oldValue ) {

      ctrl.sender.chats[ctrl.receiverID].unread = false;
      ctrl.sender.chats[ctrl.receiverID].count = 0;

      ctrl.sender.$save();

    });
  });

  promises.three = $Contact.getUser(ctrl.receiverID).then(function (user) {
    ctrl.receiverRef = user;
  });

  /**
  * Traer mensajes del chat
  * Query para traer solo los ultimos 25 mensajes
  */
  var chatPath = 'chats/chat' + ctrl.generarChatId + '/messages';
  var chatRef = firebase.database().ref(chatPath);

  ctrl.messages = $firebaseArray(chatRef.limitToLast(25));

  promises.four = ctrl.messages.$loaded().then(function () {
    // messages loaded!
  });

  /**
  * Esperamos que las promesas se resuelvan asincronamente,
  * luego ocultamos el cargador
  */
  $q.all(promises).then(function () {
    if (ctrl.sender.chats && ctrl.sender.chats[ctrl.receiverID]) {
      ctrl.sender.chats[ctrl.receiverID].unread = false;
      ctrl.sender.$save();
    }
    scrollBottom();
    hideLoader();
  });



  /******************************************************
  * Acciones
  ******************************************************/
  ctrl.formData = {};

  ctrl.sendMessage = function() {
    var message = {
      date: firebase.database.ServerValue.TIMESTAMP,
      uid: ctrl.user,
      from: ctrl.sender.info.name,
      content: ctrl.formData.message
    };
    //guadamos mensaje en el usuario actual
    ctrl.messages.$add(message).then(function () {

    }).catch(function (err) {
      $log.log('message err:', err);
    });

    // $notification.push('chat', ctrl.guessUser);

    // Validar si el objeto chats existe para evitar errores
    ctrl.sender = ctrl.sender || {};
    ctrl.sender.chats = ctrl.sender.chats || {};

    ctrl.receiverRef = ctrl.receiverRef || {};
    ctrl.receiverRef.chats = ctrl.receiverRef.chats || {};

    // Add active chat
    ctrl.sender.chats[ctrl.receiverID] = {
      id: ctrl.receiverID,
      count: 0,
      unread: false,
      lastmessage: ctrl.formData.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    ctrl.receiverRef.chats[ctrl.user] = ctrl.receiverRef.chats[ctrl.user] || {};

    ctrl.receiverRef.chats[ctrl.user] = {
      id: ctrl.user,
      count: ctrl.receiverRef.chats[ctrl.user].count + 1 || 1,
      unread: true,
      lastmessage: ctrl.formData.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    //guardar chat
    ctrl.sender.$save();
    ctrl.receiverRef.$save();

    // Notificar - push
    $push.send('chat', $user.name, ctrl.receiverID);

    //limpiar campo de texto
    ctrl.formData = {};

    scrollBottom();
  };

  /******************************************************
  * Manejar tama;o de footer
  ******************************************************/
  var footerBar; // gets set in $ionicView.enter
  var scroller;
  var txtInput; // ^^^

  $scope.$on('$ionicView.enter', function() {
    $timeout(function() {
      footerBar = document.body.querySelector('#userMessagesView .bar-footer');
      scroller = document.body.querySelector('#userMessagesView .scroll-content');
      txtInput = angular.element(footerBar.querySelector('textarea'));
    }, 0);
  });

  // I emit this event from the monospaced.elastic directive, read line 480
  $scope.$on('elastic:resize', function(e, ta, oldH, newH) {
    if (!ta) return;

    if (!footerBar) return;

    var newFooterHeight = newH + 20;
    newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

    footerBar.style.height = newFooterHeight + 'px';
    scroller.style.bottom = newFooterHeight + 'px';
  });

});
