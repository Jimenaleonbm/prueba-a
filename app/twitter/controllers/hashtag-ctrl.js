'use strict';
angular.module('twitter')
        .controller('HashtagCtrl', function ($state, $scope, TwitterREST, $mocifire, $commons) {

            var ctrl = this;

            ctrl.formData = {message: ''};
            ctrl.estado = $state.current;

            ctrl.TwitterREST = TwitterREST;


            ctrl.loadMore = function () {

                ctrl.TwitterREST.loadMore('old').then(function (data) {

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }).catch(function (error) {
                    $scope.error = "Error loading data";
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            //Cargar dinamicamente el hash
            $mocifire.get('event/info/twitter').then(function (hash) {
                ctrl.hashtag = hash;
                ctrl.TwitterREST.init(ctrl.hashtag);
                ctrl.loadMore();
                ctrl.TwitterREST.starttwitterLiveFeed();
                $commons.apply($scope);
            });

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {

                if (ctrl.estado.name != toState.name) {
                    ctrl.TwitterREST.stoptwitterLiveFeed();
                } else {
                    if (ctrl.hashtag && !ctrl.TwitterREST.isLiveEnabled) {
                        ctrl.TwitterREST.starttwitterLiveFeed();
                    }
                }
            });



            ctrl.innapBrowser = function (value) {
                window.open(value, '_blank');
            };

        });
