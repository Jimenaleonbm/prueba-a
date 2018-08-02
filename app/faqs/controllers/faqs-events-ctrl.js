'use strict';
angular.module('faqs')
    .controller('FaqsEventCtrl', function ($log, $scope, $mocifire, $filter) {

        var ctrl = this;

        ctrl.faqs = {
            loaded: false,
            data: []
        };

        /**
         * traer FAQS para eventos
         */
        $mocifire.on(['faqs'], function (data) {
            ctrl.faqs.loaded = true;
            ctrl.faqs.data = $filter('toArray')(data, true);
        });

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
