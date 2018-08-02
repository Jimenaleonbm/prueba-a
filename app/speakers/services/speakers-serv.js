'use strict';
angular.module('speakers')
.service('$speaker', function ($log, $mocifire, $q, $filter) {

  var serv = this;


  /**
  * Metodo para traer la informacion complementaria del speaker
  * conferencias
  * speakers relacionados
  */
  serv.get = function (track, id, id_evento) {
    var defered = $q.defer();
    var promise = defered.promise;

    var promises = {};

    promises.speakers = serv.related(track, id);
    promises.sessions = serv.session(id, id_evento);

    $q.all(promises).then(function (data) {
      defered.resolve(data);
    }).catch(function (err) {
      $log.log(err);
    });

    return promise;
  };

  /**
  * @param track - speaker's track id
  * @param id - speaker id: para excluirlo de la lista
  */
  serv.related = function (track, id, limit) {

    var defered = $q.defer();
    var promise = defered.promise;

    if (!track) {
        defered.resolve([]);
        return promise;
    }

    limit = limit || 6;

    var ref = firebase.database().ref('speakers');
    var query = ref.orderByChild('info/track').equalTo(track).limitToFirst(limit);

    query.on('value', function (data) {
      var speakers = data.val();

      // Excluir speaker actual del listado
      if (id && speakers[id])
        delete speakers[id];

      speakers = $filter('toArray')(speakers, true);

      defered.resolve(speakers);
    }, function (err) {
      defered.reject(err);
    });

    return promise;
  };

  serv.session = function (id, id_evento) {
    var defered = $q.defer();
    var promise = defered.promise;

    var ref = firebase.database().ref('programme').child(id_evento);
    var query = ref.orderByChild('speakers/' + id).equalTo(true);

    var sessions = {};

    query.on('value', function (data) {
      sessions.data = $filter('toArray')(data.val(), true);

      if (sessions.data)
        sessions.multiple = (sessions.data.length > 1) ? true : false;

      defered.resolve(sessions);
    }, function (err) {
      defered.reject(err);
    });

    return promise;
  };

});
