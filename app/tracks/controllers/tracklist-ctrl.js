'use strict';
angular.module('tracks')
.controller('TracklistCtrl', function ($log, $mocifire, $filter) {

  var ctrl = this;

  $mocifire.get(['tracks']).then(function (data) {
    ctrl.tracks = $filter('toArray')(data, true);
  });

});
