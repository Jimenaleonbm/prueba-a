'use strict';
angular.module('agenda')
  .service('$CurrentSession', function ($log) {

  var serv = this;

  serv.cache = {};

  serv.set = function (session, scenario, type, track, speakers) {
    serv.cache.data = {
      session: session,
      scenario: scenario || null,
      type: type || null,
      track: track || null,
    };
  };

  serv.get = function (id) {
    return serv.cache[id];
  };

});
