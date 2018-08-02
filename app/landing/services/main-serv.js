'use strict';
angular.module('landing')
    .service('MainGlobal', function ($log, $mocifire, $q, $filter, $ionicLoading) {

        var serv = this;

        // some initial data
        serv.menu = {
            data: [],
            cache: false
        };

        serv.getMenu = function () {
            return $q(function (resolve, reject) {

                if (serv.menu.cache)
                    return resolve(serv.menu.data);

                $ionicLoading.show();

                $mocifire.get('menuGlobal').then(function (data) {
                    console.log('menuGlobal', serv.menu, data);
                    serv.menu.data = $filter('orderBy')($filter('toArray')(data), 'order');
                    serv.menu.cache = true;
                    $ionicLoading.hide();
                    resolve(serv.menu.data);
                }).catch(function (err) {
                    $ionicLoading.hide();
                    reject(err);
                });

            });
        };

    });
