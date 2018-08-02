'use strict';
angular.module('tracks')
.controller('TrackdetailCtrl', function ($log, $stateParams, $speaker) {

  var ctrl = this;

  ctrl.track = $stateParams.trackdata;

  $speaker.related(ctrl.track.$key, null, 8).then(function (speakers) {
    ctrl.speakers = speakers;
  });

});
