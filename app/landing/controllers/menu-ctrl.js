'use strict';
angular.module('landing').controller('MenuGlobalCtrl',
function ($state, $mocifire, $message, $user, $log,  $ionicHistory,menu, $scope ) {

  var c = console.log;
  var ctrl = this;
  ctrl.user = $user;
  ctrl.menu = menu;

  ctrl.logout = function () {
    ctrl.user.logout().then(function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('login');
    })
  };

  //IR AL CHAT
  /*
  ctrl.goChat = function () {
    $state.go('chats');
  };
*/
/**
 * navegar a otro estado
 * @param state
 * @param disableBack
 */

  //ir a la ventana de chats
  $scope.footerGo = function (state) {
      if(ctrl.user.isAnonymous && state !== "global.landing")
          $message.alert('Para disfrutar esta sección tienes que ser un usuario registrado');
      else
      $state.go(state);
  };

  $mocifire.on(['event', 'survey'], function (event) {
    console.log('soy fqs');
    ctrl.survey = event;
  });

  ctrl.go = function (state, params) {
    if (state == "main.survey" && !ctrl.survey){
      return $message.popup("Encuesta", "Aun no hay encuestas abiertas.");
    }
    else if (state == "global.favourites" && ctrl.user.isAnonymous){
        $message.alert('Para disfrutar esta sección tienes que ser un usuario registrado');
    }
    else {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(state, params);
    }
  }

});
