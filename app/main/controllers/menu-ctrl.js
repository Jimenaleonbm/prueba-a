'use strict';
angular.module('main').controller('MenuCtrl', function ($state, $mocifire, $message, $user, $log, menu, $ionicHistory, event_id) {

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

  
  $mocifire.on(['event', 'survey'], function (event) {
    ctrl.survey = event;
  });

  ctrl.go = function (state, params) {
    params = event_id;
    if (state == "main.survey" && !ctrl.survey){
      return $message.popup("Encuesta", "Aun no hay encuestas abiertas.");
    }
    else if (state == "main.favourites" && ctrl.user.isAnonymous){
        $message.alert('Para disfrutar esta sección tienes que ser un usuario registrado');
    }
    else {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(state, {event_id: params});
      console.log('aqui---------------->',state, params)
    }
  }

});
