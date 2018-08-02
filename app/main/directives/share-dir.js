'use strict';
angular.module('main')
  .directive('share', function () {
  return {
    template: '<div class="share" ng-click="share()"><i class="ico {{icono}}"></i></div>',
    restrict: 'EA',
    scope: {
      data: '=',
      icono: '='
    },
    controller: function ($scope, $log, $timeout, $cordovaSocialSharing, $filter, $message) {

      var GenricImage = 'https://firebasestorage.googleapis.com/v0/b/colombia40-578a5.appspot.com/o/speakers%2Flogo-generico-share.png?alt=media&token=c25d811b-79a3-4cad-a915-fd5a00c6c011';

      $scope.$watch('data', function() {
        if ( ($scope.data == undefined || $scope.data == '') ) {
          $scope.data = {};
        }
      });

      $scope.$watch('icono', function() {
        if ( ($scope.icono == undefined || $scope.icono == '') ) {
          $scope.icono = 'ico-share';
        }
      });

      $scope.share = function () {
        $scope.message = $scope.data.description || '';
        $scope.message = '#Colombia4punto0 ' + $scope.data.name + ' ' + $scope.message;
        $scope.message = $filter('limitTo')($scope.message, 140).toString();

        $scope.image = ($scope.data.image) ? $scope.data.image.fullsize : GenricImage;

        $cordovaSocialSharing.share($scope.message, $scope.data.name, $scope.image ) // Share via native share sheet
          .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
          $message.alert("Ups!, Tuvimos problemas al compartir este contenido. Por favor intentalo nuevamente");
        });

      };

    }
  };
});
