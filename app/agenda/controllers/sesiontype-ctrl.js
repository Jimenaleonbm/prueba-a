'use strict';
angular.module('agenda')
  .controller('SesiontypeCtrl', function ($log, $mocifire, $ionicLoading, $timeout, $filter, $state, $CurrentSession, $FilterRules, $stateParams) {

  var ctrl = this;

  /**
  * View title
  */
  ctrl.title = {
    value: 'TALLERES',
    istype: true,
  };

  /**
  * Settings - vars
  */
  ctrl.settings = {};
  ctrl.days = {};

  /**
  * Reglas para Filtro
  */
  ctrl.rules = $FilterRules;

  /**
  * FUNCIONALIDAD DE LOS TABS (DIAS)
  */
  //definir tab activo por defecto
  ctrl.settings.panel = null;
  //fn: activa el panel seleccionado
  ctrl.selectPanel = function (selected) {
    ctrl.settings.panel = selected;
  };
  //fn: valida si el panel esta activo: bolean
  ctrl.isSelected = function (check) {
    return ctrl.settings.panel === check;
  };

  /**
  * switch: filtro por hora y escenario
  */
  ctrl.settings.sort = ctrl.settings.sort || false;

  ctrl.setFilter = function (val) {
    ctrl.settings.sort = val;
  };

  /**
  * MANEJO DE DATOS PARA AGENDA
  */
  ctrl.agenda = ctrl.agenda || [];

  $mocifire.get(['programme']).then(function (data) {

    angular.forEach(data, function (session, key) {

      if (session.info.type === $stateParams.typeid) {
        session.$id = key;

        // Set: Dia
        var day = {
          name: session.info.date, // Nombre para mostrar
          value: new Date(session.info.date) // objeto fecha para configuracion
        };

        // Toca pasar la hora de inicio de string a Integer, de no ser asi el ordenamiento por HORA no funciona como se espera
        if (session.info.hourFrom && session.info.hourFrom.hour && session.info.hourFrom.minutes)
          session.info.startInteger = parseInt(session.info.hourFrom.hour + session.info.hourFrom.minutes);

        // Crear tabs de dias
        ctrl.days[day.name] = day;

        // Agregar session al arreglo
        ctrl.agenda.push(session);
      }

    }); //**** end forEach

    /**
    * Logica para activar tab de dia
    * si aun es el evento saldra activo por defecto el primer dia del evento.
    */
    var defaultDay = ctrl.days[Object.keys(ctrl.days)[0]].name;
    ctrl.settings.panel = ctrl.settings.panel || asignarTabActivo(ctrl.days, defaultDay);

  }); // End get sessions

  /**
  * MANEJO DE DATOS PARA TIPOS DE SESION
  */
  $mocifire.get(['sessiontypes']).then(function (data) {
    ctrl.sessiontypes = data;
  });

  /**
  * MANEJO DE DATOS PARA ESCENARIOS
  */
  $mocifire.get(['scenarios']).then(function (data) {
    ctrl.scenarios = data;
  });

  /**
  * Enrutamiento: al ahcer click en una sesion
  */
  ctrl.ir = function (session, scenario, type) {

    // pasar datos de sesion seleccionada para usarlos en el detalle
    $CurrentSession.set(session, scenario, type);
    $state.go('main.session', {sessionid: session.$id});
  };

  /**
  * METODO PARA SELECCINAR EL TAB ACTIVO PARA EL DIA
  */
  var asignarTabActivo = function (dias, diaPorDefecto) {

    var diaActivo = null,
        diahoy = $filter('date')(new Date(), 'MMM d');

    angular.forEach(dias, function (dia) {

      if (dia.name === diahoy)
        diaActivo = dia.name;

    });

    if (diaActivo === null)
      diaActivo = diaPorDefecto;

    return diaActivo;
  };

});
