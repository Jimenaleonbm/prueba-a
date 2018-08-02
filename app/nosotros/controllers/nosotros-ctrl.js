'use strict';
angular.module('nosotros')
.controller('nosotrosCtrl', function ($log, $mocifire, $scope, $state, $stateParams) {

  $mocifire.get('config/nosotros').then(function (data) {
    $scope.item = data;
  });

    $scope.goBack = function () {
        if ($stateParams.nosotros)
            $state.go('global.landing');
        else
            $state.go('login');
    };

});
