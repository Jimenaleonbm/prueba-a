'use strict';
angular.module('agenda')
  .service('$Agenda', function ($log) {
    var serv = this;

    /**
     * Utils
     */
    var getDates = function(startDate, stopDate) {
      var dateArray = [];
      var currentDate = new Date(startDate);
      stopDate = new Date(stopDate);

      while (currentDate <= stopDate) {

        var day = {
          name: null, // Nombre para mostrar
          value: null // objeto fecha para configuracion
        };

        dateArray.push($filter('date')(currentDate, 'MMM d, y'));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateArray;
    }
    /**
     * Creamos un timestamp a partir del dia y hora del evento
     * @param date {string}
     * @param time {object}
     */
    serv.setTime = function (date, time) {
      var d = new Date(date);
      if (time) {
        d.setHours(parseInt(time.hour));
        d.setMinutes(parseInt(time.minutes));
      }
      return d;
    }

  });
