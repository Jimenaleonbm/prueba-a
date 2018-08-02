'use strict';
angular.module('agenda')
.service('$groupby', function ($log, $ionicScrollDelegate) {

  var serv = this;

  serv.data = {};

  serv.set = function (key) {
    serv.data.select = key;
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollTop();
  };

  serv.isSelected = function (key) {
    return serv.data.select === key;
  };

});
