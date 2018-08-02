'use strict';
angular.module('main')
    .directive('mocSlider', function () {
        return {
            restrict: 'E',
            scope: {
                items: '<'
            },
            templateUrl: 'main/templates/slider.html',
            controller: function ($scope, $mocifire, $filter, $timeout) {

                $scope.tpls = {
                    video: 'main/templates/slider/video-tpl.html',
                    image: 'main/templates/slider/image-tpl.html'
                };

                $scope.getTemplate = function (type) {
                    return $scope.tpls[type];
                };

                /**
                 * init slider
                 */
                $scope.slider = null;
                $scope.sliderOptions = {
                    loop: true,
                    effect: 'slide',
                    autoplay: 5000,
                    autoplayDisableOnInteraction: false,
                    pagination: false
                };

                $timeout(function () {
                    $scope.slider.stopAutoplay();
                    $scope.slider.update();
                    $scope.slider.startAutoplay();
                }, 200);
            }
        };
    });
