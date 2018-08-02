'use strict';
angular.module('_Mocifire').service('$message', function ($q, $window, $cordovaDialogs, $ionicPopup, $ionicLoading, $log) {

  return {
    alert: function (text, duration, position, callback) {
      if ($window.plugins && $window.plugins.toast && text) {
        $window.plugins.toast.showWithOptions({
          message: text,
          duration: (!duration || duration == "short") ? 2000 : 5000,
          position: (position) ? position : "center"
        }, function (result) {
          if (result && result.event == 'touch') {
            callback();
          }
        });
      } else {
        $log.log(text);
      }
    },
    popup: function (title, message, button) {
      return $q(function (resolve, reject) {
        if (navigator.notification) {
          $cordovaDialogs.alert(message, title, ((!button) ? "OK" : button)).then(function () {
            resolve();
          });
        } else {
          $ionicPopup.alert({
            title: title,
            subTitle: message,
            okText: (!button) ? "OK" : button
          }).then(function () {
            resolve();
          });
        }
      });
    },
    confirm: function (title, message, accept, cancel) {
      return $q(function (resolve, reject) {
        if (navigator.notification) {
          $cordovaDialogs.confirm(message, title, [((accept) ? accept : "Aceptar"), ((cancel) ? cancel : "Cancelar")]).then(function (index) {
            if (index === 1)
              resolve();
            else
              reject();
          });
        } else {
          $ionicPopup.confim({
            title: title,
            subTitle: message,
            okText: (!accept) ? "Aceptar" : accept,
            cancelText: (!cancel) ? "Cancelar" : cancel
          }).then(function (res) {
            if (res)
              resolve();
            else
              reject();
          });
        }
      });
    },
    prompt: function (title, message, placeholder, accept, cancel) {
      return $q(function (resolve, reject) {
        if (navigator.notification) {
          $cordovaDialogs.prompt(message, title, [((accept) ? accept : "Aceptar"), ((cancel) ? cancel : "Cancelar")], placeholder).then(function (result) {
            if (result.buttonIndex === 1 && result.input1 !== placeholder)
              resolve(result.input1);
            else
              reject();
          });
        } else {
          $ionicPopup.prompt({
            title: title,
            subTitle: message,
            inputPlaceholder: (!placeholder) ? "" : placeholder,
            okText: (!accept) ? "Aceptar" : accept,
            cancelText: (!cancel) ? "Cancelarar" : cancel
          }).then(function (res) {
            if (res)
              resolve(res);
            else
              reject();
          });
        }
      });
    },
    loading: function (text) {
      if($window.wizSpinner){
        $window.wizSpinner.show({
          position: 'middle',
          label: (text) ? text : "Cargando...",
          showSpinner: true,
          opacity: 0.4
        });
      } else {
        $ionicLoading.show({ template: (text) ? text : "Cargando..." });
      }

    },
    hide: function () {
      if($window.wizSpinner)
        $window.wizSpinner.hide();
      else
        $ionicLoading.hide();
    },
    sound: function (times) {
      if (navigator.notification)
        $cordovaDialogs.beep(times);
    },
    vibrate: function (milliseconds) {
      if (navigator.notification)
        $cordovaDialogs.vibrate(milliseconds);
    }

  };

});
