'use strict';
angular.module('agenda')
  .filter('timeformat', function ($log) {
  return function (input) {

    return input;

    // separar entero por dos puntos
    var addDots = function (val) {
      var len, result;

      val = val.toString();
      len = val.length;
      result = val.substring(0, len-2) + ':' + val.substring(len-2);

      return result;
    };

    // establecer nuevo formato
    var setTime = function (val) {

      // Limpiar hora
      val = val.replace(':', '').replace(' ', '').replace('am', '').replace('pm', '').replace('m', '');

      // Logica AM
      if (val <= 1200) {
        return addDots(val) + ' am';
      }

      // logia PM
      val -= 1200;
      return addDots(val) + ' pm';
    };

    angular.forEach(input, function (val) {
      if (val.general.start)
        val.general.horaInicio = setTime(val.general.start);

      if (val.general.end)
        val.general.horaFin = setTime(val.general.end);
    });

    return input;

  }
});
