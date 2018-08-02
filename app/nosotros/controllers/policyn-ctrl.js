'use strict';
angular.module('nosotros')
.controller('PolicynCtrl', function ($log, $mocifire, $scope) {

  /*$mocifire.get('about/policy').then(function (data) {
    $scope.item = data;
  });*/

  $mocifire.get('config/nosotros').then(function (data) {
        $scope.item = data;
    });

});
