'use strict';
angular.module('agenda')
  .filter('checkHour', function ($log) {
  return (function (input) {

    var out = [];

    angular.forEach(input, function (session) {
      if ( session.info.hourFrom || (session.info.allDay && session.info.allDay.value) )
        out.push(session);
    });

    return out;

  });
})
  .filter('filteragenda', function ($log, $FilterRules) {

  var checkObj = function (obj) {
    var _check = [], _count = 0, result = true;

    angular.forEach(obj, function (val, key) {
      if (val === false)
        _check.push(key);
      _count++;
    });

    if (_check.length === _count)
      result = false;

    return result;
  };

  return function (input, speaker) {

    $FilterRules.CHECK.track = checkObj($FilterRules.data.track);
    $FilterRules.CHECK.type = (speaker) ? false : checkObj($FilterRules.data.type);

    if (!$FilterRules.CHECK.track && !$FilterRules.CHECK.type) {
      $FilterRules.CHECK.empty = false;
      return input;
    }

    /**
    * Logica filtro
    */

    var out = [];

    angular.forEach(input, function (item) {

      var _check = [];
      var count = 0;

      angular.forEach($FilterRules.data, function (val, key) {

        if (!$FilterRules.CHECK[key] || val[item.info[key]])
          _check.push([key]);

        count++;

      });

      if (count === _check.length)
        out.push(item);

    });

    $FilterRules.CHECK.empty = (out.length === 0) ? true : false;

    return out;
  };
});
