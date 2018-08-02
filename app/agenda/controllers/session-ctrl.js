'use strict';
angular.module('agenda')
  .controller('SessionCtrl', function ($log, $scope, $CurrentSession, $fav, $stateParams, $mocifire, $q, $push, $message, event_id, $user) {

  var ctrl = this;

  ctrl.user = $user;

  ctrl.loading = {
    inprogress: false
  };

  ctrl.cache = $CurrentSession.cache;

    /**
  * Speakers relacionados
  */
  if (ctrl.cache.data.session && ctrl.cache.data.session.speakers) {

    var promises = [];
    ctrl.speakers = [];
    ctrl.loading.inprogress = true;


    angular.forEach(ctrl.cache.data.session.speakers, function (val, key) {

      var promise = $mocifire.get('speakers/' + key).then(function (data) {
        var speaker = data;
        speaker.$id = key;
        ctrl.speakers.push(speaker);
      });

      promises.push(promise);

    });

    $q.all(promises).then(function (data) {
      //success callback
      ctrl.loading.inprogress = false;
    });

  }

  /**
  * Favoritos
  */
  ctrl.fav = $fav.is('programme', $stateParams.sessionid);

  ctrl.favorito = function (bool) {
    if(bool){
      $fav.new('programme', $stateParams.sessionid, event_id);
      ctrl.fav = true;
      var date = new Date(ctrl.cache.data.session.info.date);

      if (!ctrl.cache.data.session.info.allDay || !ctrl.cache.data.session.info.allDay.value) {
          date.setHours(ctrl.cache.data.session.info.hourFrom.hour);
          date.setMinutes(ctrl.cache.data.session.info.hourFrom.minutes);
      }

      $push.reminder($stateParams.sessionid, ctrl.cache.data.session.info.name, date);
      $message.alert("Te recordaremos 30 minutos antes de que empiece este evento!");
    } else {
      $fav.remove('programme', $stateParams.sessionid);
      ctrl.fav = false;
      $push.cancelReminder($stateParams.sessionid);
    }

    if ($scope.$root && $scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
  };

  if ($scope.$root && $scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();

});
