'use strict';
angular.module('agenda')
  .directive('groupby', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'agenda/templates/groupby.html',
    controller: function ($scope, $groupby) {

      // Tabs
      $scope.tabs = [
        { name: 'Hora', key: 'hour' },
        { name: 'Sección', key: 'track' },
        { name: 'Categoria', key: 'category' }
      ];

      // Crear data binding con el servicio
      $scope.groupby = $groupby;

      // set tab por defecto
      if (!$scope.groupby.data.select)
        $scope.groupby.data.select = $scope.tabs[0].key;

    }
  };
});
