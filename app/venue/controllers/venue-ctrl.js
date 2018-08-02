'use strict';
angular.module('venue').controller('VenueCtrl', function ($mocifire, $scope, $ionicScrollDelegate, $sce, event_id, $comoLlegar) {
  
  var ctrl = this;

  ctrl.comoLlegar = $comoLlegar;

  // Init map
  $scope.defaults = {
    tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    zoomControl: false
  };

  $scope.markers = {};
  $scope.center = {};

  
  //Mostrar ubicacion en el mapa
  ctrl.active = null;

  ctrl.setMap = function (mapobj, id) {
    ctrl.active = id;
    $scope.center = mapobj;

    $scope.markers.main = {
      lat: mapobj.lat,
      lng: mapobj.lng
    }
  };

  ctrl.checkActive = function (id) {
    return ctrl.active === id;
  };

  // Mostrar imagen
  ctrl.images = {};

  ctrl.setImg = function (id) {
    ctrl.images[id] = !ctrl.images[id];
    $ionicScrollDelegate.resize();
  };

  ctrl.checkImg = function (id) {
    return ctrl.images[id];
  };

    /**
    * get venues
    */
  ctrl.venues = {};
  
  $mocifire.get(['venues', event_id]).then(function (data) {

    if (!data) return;

    ctrl.venues = data;

    console.log(data);

    angular.forEach(ctrl.venues, function (val, key) {
      val.id = key;
      val.description = $sce.trustAsHtml(val.description) || null;
    });
    
    var _mapinit = ctrl.venues[Object.keys(ctrl.venues)[0]];
    ctrl.setMap(_mapinit.map, _mapinit.id);
  });

});
