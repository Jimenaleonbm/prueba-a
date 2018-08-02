'use strict';
angular.module('speakers')
  .controller('SpeakersListCtrl', function ($mocifire, $fav, $FilterRules, $filter, $timeout, $scope, event_id, $q, $commons) {

  var ctrl = this;

  $fav.init();

  $scope.config = {
    loaded: false
  };

  /**
  * Filtro
  */
  ctrl.filter = $FilterRules;
  ctrl.tpl = { filter: 'speakers/templates/filter.html' };

  /**
  * MANEJO DE DATOS
  */
  $mocifire.get(['event_speakers', event_id]).then(function (data) {
    console.log('artista----->',event_id)
    var promesas = {};
    angular.forEach(data, function (val, key) {
       if (val)
        promesas[key] = $mocifire.get(['speakers', key]);
    });

    $q.all(promesas).then(function (speakers_data) {
        ctrl.data = speakers_data;
        ctrl.init(speakers_data);
        $scope.config.loaded = true;
    });
  });

  ctrl.init = function (data, toggle) {
    resetRender();
    ctrl.speakers = $filter('toArray')(data, true);
    if (toggle)
      ctrl.filter.toggle();
  };

  /**
  * Carga en demanda
  * 1. loadmore function
  * 2. variable para saber cuando no hay mas datos
  */
  ctrl.loadMore = function () {
    ctrl.renderLimit = ctrl.renderLimit + 4;
    if (ctrl.renderLimit >= ctrl.speakers.length) {
      ctrl.isMoreData = false;
    }
    $timeout(function(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    },100);
  };

  var resetRender = function () {
    ctrl.renderLimit = 8;
    ctrl.isMoreData = true;
  };

  resetRender();

});
