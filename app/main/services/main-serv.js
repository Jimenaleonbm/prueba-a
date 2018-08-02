'use strict';
angular.module('main')
    .service('Main', function ($log, $mocifire, $q, $filter, $ionicLoading) {

        var serv = this;

        // some initial data
        serv.menu = {
            data: [],
            cache: false
        };

        function setGoogle(ua) {
            if (ua && window.ga) {
                window.ga.startTrackerWithId(ua);
                window.ga.trackView("init");
            }
        }

        /**
         * traer settings del evento
         * @returns {*}
         */
        serv.initSettings = function () {
            return $q(function (resolve, reject) {
                $mocifire.get(['settings']).then(function (data) {
                    if (data) {
                        serv.UA = data.analytics || null;
                        serv.register = data.register || null;
                        setGoogle(serv.UA);
                    }
                    resolve();
                }).catch(function (err) {
                    reject(err);
                })
            })
        };

        serv.getMenu = function () {
            return $q(function (resolve, reject) {

                if (serv.menu.cache)
                    return resolve(serv.menu.data);

                $ionicLoading.show();

                $mocifire.get('menu').then(function (data) {
                    serv.menu.data = $filter('orderBy')($filter('toArray')(data), 'order');
                    serv.menu.cache = true;
                    $ionicLoading.hide();
                    resolve(serv.menu.data);
                    console.log("menu", serv.menu.data);
                }).catch(function (err) {
                    $ionicLoading.hide();
                    reject(err);
                });

            });
        };

    });
