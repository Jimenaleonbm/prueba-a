'use strict';
angular.module('sponsors')
  .controller('SponsorCtrl', function ($log, $mocifire, $stateParams, event_id) {

  var ctrl = this;
  ctrl.exchange = {};
  ctrl.documents = [];

  ctrl.idExchange = $stateParams.idSponsor;

  $mocifire.get(['sponsors', event_id, $stateParams.idSponsor]).then(function (data) {
    ctrl.exchange = data;
  });

  ctrl.openUrl = function (path) {
    window.open(path, '_blank', 'location=no');
  };

});
