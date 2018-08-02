'use strict';
angular.module('terms')
.controller('TermsCtrl', function ($log, $mocifire, $scope, $state, $stateParams) {

  $mocifire.get('config/terms').then(function (data) {
    $scope.item = data;
  });

    $scope.goBack = function () {
        if ($stateParams.term)
            $state.go('global.landing');
        else
            $state.go('login');
    };

});
