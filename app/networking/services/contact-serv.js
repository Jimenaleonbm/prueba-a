'use strict';
angular.module('networking')
  .service('$Contact', function ($log, $q, $user, $mocifire, $firebaseObject, $push) {

  /**
  * Service: $Fire
  * Inyectamos servicio $Fire requerido para verificar si el usuario
  * actual esta autenticado con firebase.
  * Si se requeire modificar el servicio lo ubicamos en:
  * app/fire/services/fire-serv.js
  */

  var serv = this;

  /**************************************************
  * 1. Traer usuario por id
  **************************************************/
  /**
  * Traer datos de usuario de firebase,
  * requerido para toda funcionalidad de networking
  */
  serv.getUser = function (userid) {

    // Init promise
    var defered = $q.defer(),
        promise = defered.promise;

    if (!userid) {
      defered.reject("@userid: it's required");
      return promise;
    }

    var userid = userid;

    // Construir referencia al usaurio
    var userRef = firebase.database().ref('users/' + userid);

    // Ya que se requiere un three-way data binding se debe retornar un objeto de firebase
    // que escuche si hay cambios en el usuaro y de este modo actualizar en tiempo real.
    var user = $firebaseObject(userRef);

    // esperar qeu los datos del usuario sean cargados
    // luego resolver la promesa
    user.$loaded().then(function (data) {
      // Resolver promesa
      defered.resolve(user);

    }, function (err) {
      defered.reject(err);
    });

    return promise;
  };

  /**************************************************
  * 2. Metodos para leer y escribir datos en FB
  **************************************************/

  /**
  * Metodo: enviar solicitud de contacto
  * @receiver: id del usuario destinatario / requerido
  *
  * En el Usuario destinatario se debe guardar la referencia
  * del usuario actual (el que envia la solicitud),
  * de este modo se pueden listar las solicitudes del usuario.
  */
  serv.request = function (receiver) {
    // Init promise
    var defered = $q.defer(),
        promise = defered.promise;

    if (!receiver) {
      defered.reject("id param it's required");
      return promise;
    }

    // Sender: usuario actual
    var senderKey = $user.uid;

    var promises = {};

    /**
      * Referencia al usuario destinatario:
      * 1. Ya que el id del usuario es un valor numerico, anteponemos la palabra "user"
      * para que firebase no tome el OBJETO 'users' como un ARRAY.
      * 2. las solicitudes se deben guardar en un OBJETO dentro del usuario destinatario,
      * en este caso en el OBJETO 'requests'
      */
    var receiverkey = receiver;
    var requestsRef = 'users/' + receiverkey + '/requests/' + senderKey;
    /**
      * Guardar 'senderid' en el OBJETO 'requests' y debe ser de tipo boleano,
      * y valor por defecto FALSE ya que cuando el destinatario acepte la solicitud
      * el valor cambiara a TRUE
      * e.g requests: { senderid: false }
      */
    promises.uno = $mocifire.set(requestsRef, {
      id: senderKey,
      status: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(function () {
      // success ...
    }).catch(function (err) {
      // Error ...
    });

    /**
      * Notificar al usuario que tiene una nueva solicitud
      * se crea en el usuario destinatario un OBJECTO 'notifications'
      * que contiene la propiedad 'request' de tipo boleano
      */
    var notification = 'users/' + receiverkey + '/notifications/request';
    promises.dos = $mocifire.set(notification, true).then(function () {
      // success ...
    }).catch(function (err) {
      // Error ...
    });

    // Manejar multiples promesas asincronamente
    $q.all(promises).then(function () {

      // Enviar push
      $push.send('request', $user.name, receiver);

      defered.resolve();
    }).catch(function (err) {
      defered.reject(err);
    });

    return promise;
  };

  /**
  * Metodo: aceptar solicitud
  */
  serv.acceptRequest = function (fireuser, receiverid) {

    // Init promise
    var defered = $q.defer(),
        promise = defered.promise;

    if (!fireuser) {
      defered.reject('Both parameters are required!');
      return promise;
    }

    var promises = {};

    /**
      * Establecer true en el id del usuario para permitir ver la tarjeta de contacto
      */
    fireuser.requests[receiverid] = fireuser.requests[receiverid] || {};
    
    fireuser.requests[receiverid].status = true;
    fireuser.requests[receiverid].id = fireuser.requests[receiverid].id || receiverid;
    fireuser.requests[receiverid].timestamp = firebase.database.ServerValue.TIMESTAMP;

    promises.uno = fireuser.$save();

    var requestsRef = 'users/' + receiverid + '/requests/' + $user.uid;
    var notificationRef = 'users/' + receiverid + '/notifications/request';

    promises.dos = $mocifire.set(requestsRef, {
      id: $user.uid,
      status: true,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // notificar localmente
    promises.tres = $mocifire.set(notificationRef, true);

    // Manejar multiples promesas asincronamente
    $q.all(promises).then(function () {

      // Enviar push
      $push.send('answer', $user.name ,receiverid);

      defered.resolve();
    }).catch(function (err) {
      defered.reject(err);
    });

    return promise;
  };

  /**
  * Metodo: ignorar solicitud
  * @fireuser: firebase object
  * @receiverid: id de usuario que hace la peticion e.g 47
  */
  serv.ignoreRequest = function (fireuser, receiverid) {

    // Init promise
    var defered = $q.defer(),
        promise = defered.promise;

    if (!fireuser) {
      defered.reject('Both parameters are required!');
      return promise;
    }

    fireuser.requests[receiverid] = null;

    fireuser.$save().then(function () {
      defered.resolve();
    }, function (err) {
      defered.reject(err);
    });

    return promise;
  };

  /**
  * Metodo: Borrar usuario
  */
  serv.remove = function (receiverid) {

    // Init promise
    var defered = $q.defer(),
        promise = defered.promise;

    if (!receiverid) {
      defered.reject('Receiver id is required!');
      return promise;
    }

    var promises = {};
    var userRef = 'users/' + $user.uid + '/requests/' + receiverid;
    var receiverRef = 'users/' + receiverid + '/requests/' + $user.uid;

    promises.one = $mocifire.set(userRef, null);
    promises.two = $mocifire.set(receiverRef, null);

    $q.all(promises).then(function () {
      defered.resolve();
    }).catch(function (err) {
      defered.reject(err);
    });

    return promise;
  };

  /**
  * Metodo: Listar mis business cards
  */
  serv.list = function () {

  };

  /**
  * Metodo: Traer datos de contacto
  */
  serv.get = function () {

  };

});
