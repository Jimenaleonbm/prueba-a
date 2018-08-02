'use strict';
angular.module('wall')
.controller('PostCommentsCtrl', function ($mocifire, $commons, $scope, $stateParams, $user, $timeout, $ionicScrollDelegate, event_id) {

  var ctrl = this;

  ctrl.focus = $stateParams.focus;
  ctrl.post_id = $stateParams.post_id;

  /**
   * scroll bottom para mostrar el ultimo mensaje que en este caso seria
   * el del usuario
   */
  var viewScroll = $ionicScrollDelegate.$getByHandle('postMessageScroll');
  var scrollBottom = function () {
    $timeout(function() {
      viewScroll.scrollBottom(true);
    }, 0);
  };

  /**
   * evaluar si el usuario selecciono comentar o ver comentarios
   * si selecciono comentar abrir campo de texto con teclado desplegado
   */
  if (ctrl.focus) {
    // set autofocus
    $timeout(function () {
      var elem = angular.element( document.getElementById( 'write_comment' ) );
      elem[0].focus();
    }, 10);
  }

  /**
   * traer comentarios del post
   */
  $mocifire.on(['post_comments', ctrl.post_id], function (comments) {
    ctrl.comments = comments;
  });

  /**
   * agregar comentario3
   * @param text
   */
  ctrl.post_comment = function (text) {

    if (!text) return;

    var comment = {
      date: firebase.database.ServerValue.TIMESTAMP,
      text: text,
      user: {
        id: $user.uid,
        name: $user.name || 'usuario anonimo',
        image: $user.image || null
      }
    };

    /**
     * enviar comentario
     */
    $mocifire.push(['post_comments', ctrl.post_id], comment);

    /**
     * sumar el numero de comentarios para reducir el numero de consultas a la BD
     */
    var commentsRef = firebase.database().ref('wall').child(event_id).child(ctrl.post_id).child('comments');
    commentsRef.transaction(function(current_comments) {
      return current_comments + 1;
    });

    $scope.message = {};
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
      footerBar = document.body.querySelector('#postMessagesView .bar-footer');
      scroller = document.body.querySelector('#postMessagesView .scroll-content');
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
