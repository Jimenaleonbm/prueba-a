'use strict';
angular.module('_Mocifire').factory("$mocifire", function ($q, _firebase) {
  var service = this;

  var database = _firebase.database();
  var storage = _firebase.storage();

  /**
   * Permite obtener la referencia en la base de datos.
   * @returns String
   */
  service.path = function (index) {
    if(typeof index == "string")
      return index;
    else if(!index || index.length < 1)
      return "/";

    var ref = "";
    for (var i in index) { ref += index[i] + "/"; }
    return ref;
  }

  /**
   * Permite obtener datos actualizando en tiempo real.
   * @param {String - Array} index
   * @param {Function} cb
   */
  service.on = function (index, cb) {
    database.ref(service.path(index)).on('value', function (snapshot) {
      cb(snapshot.val());
    });
  }

  /**
   * Permite obtener datos de la base de datos.
   * @param {String - Array} index
   * @returns Promise
   */
  service.get = function (index) {
    return $q(function (resolve, reject) {
      database.ref(service.path(index)).once('value').then(function (snapshot) {
        if(!snapshot)
          reject();
        else
          resolve(snapshot.val(), snapshot.getKey());
      });
    });
  }

  /**
   * Permite establecer información en la referencia ingresada.
   * @param {String - Array} index
   * @param {Object} data
   * @returns Promise
   */
  service.set = function (index, data) {
    return $q(function (resolve, reject) {
      database.ref(service.path(index)).set(data).then(function(){
          resolve();
      }, function(error){
          reject(error);
      });
    });
  }

  /**
   * Permite actualizar información en la referencia ingresada. Ideal para formularios cuando se usa el metodo `on`.
   * @param {String - Array} index
   * @param {Object} data
   * @returns Promise
   */
  service.update = function (index, data) {
    return $q(function (resolve, reject) {
      database.ref(service.path(index)).update(data).then(function(){
          resolve();
      }, function(error){
          reject(error);
      });
    });
  }

  /*
   * Permite crear un nodo hijo de la referencia ingresada, con los datos enviados.
   * @param {String - Array} index
   * @param {Object} data
   * @returns Promise
   */
  service.push = function (index, data) {
    return $q(function (resolve, reject) {
      var push = database.ref(service.path(index)).push(data);
      push.then(function(){
          resolve(push.key);
      }, function(error){
          reject(error);
      });
    });
  }

  /**
   * Permite borrar información en la referencia seleccionada.
   * @param {Object} index
   * @returns Promise
   */
  service.remove = function (index) {
    return $q(function(resolve, reject){
      database.ref(service.path(index)).remove().then(function(){
        resolve();
      }, function (error) {
        reject(error);
      });
    });
  }

  /**
   * Permite enviar información a firebase como transacciones.
   * @param {String - Array} index
   * @param Function cb1
   * @param Function cb2
   */
  service.transaction = function (index, cb1, cb2) {
    var ref = service.path(index).substr(0, service.path(index).length - 1);
    database.ref(ref).transaction(cb1, cb2);
  }

  /**
   * Permite cargar archivos.
   * @param {String - Array} index "usuario/info/foto"
   * @param {Array} files
   * @returns Promise
   */
  service.upload = function (index, file, cb) {
    return $q(function(resolve, reject){
      var uploadTask = storage.ref(service.path(index)).child(file.$ngfName).put(file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        if(cb !== undefined)
          cb((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      }, function(error) {
        reject(error);
      }, function() {
        resolve(uploadTask.snapshot.downloadURL);
      });
    });
  }

  return service;
});
