'use strict';
angular.module('main')
  .directive('socialNetworks', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      model: '='
    },
    templateUrl: $sce.trustAsResourceUrl('main/templates/social-networks.html'),
    controller: function ($log, $scope, $mocifire, $commons) {

      $scope.model = $scope.model || {};

      $scope.$watch('model', function() {
        if ( ($scope.model == undefined || $scope.model == '') ) {
          $scope.model = {};
        }
      });

      $scope.goNetwork = function (id) {
        var path = $sce.trustAsResourceUrl(id);
        return cordova.InAppBrowser.open(path, '_system', 'location=no');
      }

      /**
      * Get Redes
      */
      $mocifire.get('socialNetworks').then(function (data) {
        $scope.Networks = data;
        $commons.apply($scope);
      });
    }
  };
});
