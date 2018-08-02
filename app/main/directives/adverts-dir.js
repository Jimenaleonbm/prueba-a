'use strict';
angular.module('main')
  .directive('adverts', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'main/templates/banner.html',
    controller: function ($scope, $mocifire, $filter, $timeout) {

      var currentPlatform = ionic.Platform.platform();

      /**
      * init slider
      */
      $scope.slider = null;
      $scope.sliderOptions = {
        loop: true,
        effect: 'slide',
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: false
      };

      $mocifire.get('adverts').then(function (data) {
        $scope.adverts = $filter('toArray')(data, true);

        angular.forEach($scope.adverts, function (val) {
          if (val.links && val.links.stores)
            val.links.url = (val.links[currentPlatform]) ? val.links[currentPlatform] : null;
        });

        $timeout(function () {
          $scope.slider.stopAutoplay();
          $scope.slider.update();
          $scope.slider.startAutoplay();
        }, 200);

      });

        /**
         * Abrir link externo
         */
        $scope.link = function (path) {
          if (!path) return;
            cordova.InAppBrowser.open(path, '_system', 'location=yes');
        }

    }
  };
});
