'use strict';
angular.module('news').controller('NewsCtrl', function ($scope, $mocifire, $commons, $filter) {

    var ctrl = this;

    $scope.news = {
        loaded: false,
        empty: true,
        data: [],
        tpl: 'landing/templates/news.html'
    };

    /**
     * Feed de noticias
     */
    var ref = firebase.database().ref('news');
    var query = ref.orderByChild('fecha');

    query.on('value', function (data) {
        $scope.news.data = $filter('orderBy')($filter('toArray')(data.val(), true), 'fecha', true);
        $commons.apply($scope);
    });

});
