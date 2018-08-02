'use strict';
angular.module('livestream').controller('StreamListCtrl', function ($scope, $mocifire, $filter, $commons) {

    $mocifire.on('streaming', function (data) {

        // init variables
        $scope.list = {};
        $scope.list.data = $filter('orderBy')($filter('toArray')(data, true), 'date', true);

        $commons.apply($scope);
    });

});
