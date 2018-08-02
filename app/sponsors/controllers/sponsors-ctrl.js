'use strict';
angular.module('sponsors')
  .controller('SponsorsCtrl', function ($log, $state, $stateParams, $ionicLoading, $mocifire, $filter, event_id) {

  var ctrl = this;

  var currentPlatform = ionic.Platform.platform();

  $mocifire.get('sponsortypes').then(function (data) {
    ctrl.types = data;
  });

  $mocifire.get(['sponsors', event_id]).then(function (data) {
    ctrl.sponsors = $filter('toArray')(data, true);

    angular.forEach(ctrl.sponsors, function (val) {
      if (val.links && val.links.stores)
        val.links.url = (val.links[currentPlatform]) ? val.links[currentPlatform] : null;
    });

  });

  ctrl.ir = function (id) {
    $state.go('main.sponsor', {
      idSponsor: id
    });
  };

});
