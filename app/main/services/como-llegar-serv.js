'use strict';
angular.module('main')
  .service('$comoLlegar', function ($log) {

  var service = this;

  service.hallarRuta = function(latFin, lngFin) {

    launchnavigator.navigate([latFin, lngFin], function (data) {
      $log.log('success cb:', data);
    }, function (err) {
      $log.log('error:', err);
    });
    /*
    navigator.geolocation.getCurrentPosition(function (position) {
      launchnavigator.navigate([latFin, lngFin], { start: position.coords.latitude + ", " + position.coords.longitude});
    });
    */
  };

});
