'use strict';
angular.module('favourites').service('$fav', function ($user, $mocifire, $rootScope) {

    var $fav = this;

    $fav.list = {};

    $fav.init = function () {
        $mocifire.on(['users', $user.uid, 'favorites'], function (favorites) {
            if (!favorites) return;

            if (favorites.programme) {
                $fav.list.programme = {};
                angular.forEach(favorites.programme, function (item, key) {
                    $mocifire.get(['programme', item.event_id, key]).then(function (data) {
                        if (!data) return;
                        data.event_id = item.event_id;
                        $fav.list.programme[key] = data;
                    });
                });
            }

            if (favorites.speakers) {
                $fav.list.speakers = {};
                angular.forEach(favorites.speakers, function (item, key) {
                    $mocifire.get(['speakers', key]).then(function (data) {
                        if (data)
                        $fav.list.speakers[key] = data;
                    });
                });
            }

            if (favorites.events) {
                $fav.list.events = {};
                angular.forEach(favorites.events, function (item, key) {
                    $mocifire.get(['events', key, 'info']).then(function (data) {
                        if (!data) return;
                        data.order = new Date(data.dateFrom);
                        $fav.list.events[key] = data;
                    });
                });
            }

            if ($rootScope.$root && $rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest')
                $rootScope.$apply();

        });
    };

    /**
     * Permite saber si un tipo de contenido se encuentra como favorito.
     * category ->
     */
    $fav.is = function (category, id) {
        return ($fav.list[category] && $fav.list[category][id]);
    };

    $fav.new = function (category, id, event_id) {
        return $mocifire.set(['users', $user.uid, 'favorites', category, id], {value: true, event_id: event_id || null});
    };

    $fav.remove = function (category, id) {
        return $mocifire.remove(['users', $user.uid, 'favorites', category, id]);
    }

});
