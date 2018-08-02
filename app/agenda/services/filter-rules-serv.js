'use strict';
angular.module('agenda')
.service('$FilterRules', function ($log) {

  var serv = this;

  serv.CHECK = {};

  serv.data = {};

  serv.popup = {};

  serv.toggle = function () {
    serv.popup.value = !serv.popup.value;
  };

  serv.setTracks = function (items) {
    serv.data.track = items;
  };

  serv.setType = function (items) {
    serv.data.type = items;
  };

});
