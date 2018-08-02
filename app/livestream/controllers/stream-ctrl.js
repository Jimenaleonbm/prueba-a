'use strict';
angular.module('livestream').controller('StreamCtrl', function ($scope, $mocifire, $sce, $stateParams) {

  $scope.item = $stateParams.streaming;

});
