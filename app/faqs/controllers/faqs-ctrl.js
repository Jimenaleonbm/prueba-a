'use strict';
angular.module('faqs')
    .controller('FaqsCtrl', function ($log,$fav, $scope, $mocifire, $filter,$stateParams,$q,$commons) {

        var ctrl = this;
        $fav.init();
        ctrl.faqs = {
            loaded: false,
            data: []
        };

        /**
         * traer FAQS
         */
        $mocifire.get(['event_faqs', $stateParams.event_id]).then(function (data) {
           
            var promesas = {};
            angular.forEach(data, function (val, key) {
                console.log('valor--->',val,'llave----->',key)
               if (val)
                promesas[key] = $mocifire.get(['faqs', key]);
            });
        
            $q.all(promesas).then(function (faqs_data) {
                ctrl.data = faqs_data;
                console.log(faqs_data);
                ctrl.init(faqs_data);
                ctrl.faqs.loaded = true;
            });
          });
        
          ctrl.init = function (data, toggle) {
            ctrl.faqs.data = $filter('toArray')(data, true);
            if (toggle)
              ctrl.filter.toggle();
          };
        /**
         * Accordion
         * @type {{}}
         */
        ctrl.itemSelected = {};

        ctrl.selectItem = function (id) {
            ctrl.itemSelected[id] = !ctrl.itemSelected[id];
        };

        ctrl.checkItem = function (check) {
            return ctrl.itemSelected[check] === true;
        };

    });
