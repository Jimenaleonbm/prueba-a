'use strict';
angular.module('speakers')
  .controller('SpeakerCtrl', function ($scope, $mocifire, $stateParams, $fav, $commons, $speaker, event_id, $ionicLoading, $user) {

  var ctrl = this;

  ctrl.user = $user;


  $ionicLoading.show();

  $mocifire.get(['speakers', $stateParams.idSpeaker]).then(function (data) {
    $ionicLoading.hide();
    ctrl.speaker = data;
    ctrl.fav = $fav.is('speakers', $stateParams.idSpeaker);

    if (ctrl.speaker.info.track) {
      $mocifire.get([ 'tracks', ctrl.speaker.info.track ]).then(function (data) {
        ctrl.track = data;
      });
    }

    $speaker.get(ctrl.speaker.info.track, $stateParams.idSpeaker, event_id).then(function (result) {
      ctrl.related = result.speakers;
      ctrl.sessions = result.sessions;
      $commons.apply($scope);
    });
  });

  $mocifire.get([ 'scenarios', event_id ]).then(function (data) {
    ctrl.scenarios = data;
  });

  /**
  * Favoritos
  */
  ctrl.favorito = function (bool) {
    if(bool){
      $fav.new('speakers', $stateParams.idSpeaker);
      ctrl.fav = true;
    } else {
      $fav.remove('speakers', $stateParams.idSpeaker);
      ctrl.fav = false;
    }
    if ($scope.$root && $scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
  };

});
