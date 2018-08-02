'use strict';
angular.module('terms')
.controller('PolicyCtrl', function ($log, $mocifire, $scope) {

  /*$mocifire.get('about/policy').then(function (data) {
    $scope.item = data;
  });*/

  $mocifire.get('config/terms').then(function (data) {
        $scope.item = data;
    });

});
