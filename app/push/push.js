'use strict';
// mcht@mintic.gov.co Applemintic20
angular.module('push', []).service("$push", function ($state, $http, $mocifire, $message) {

  var service = this;
  var push = null;

  service.init = function () {
    if(!window.cordova) return;

    

      push = PushNotification.init({
        android: {senderID: "333553856105", forceShow: true, clearBadge: true},
        ios: {alert: true, badge: true, sound: true, clearBadge: true}
      });
      console.log('buya')
    push.on('registration', function (data) {
      
      push.token = data.registrationId;
      if (service.uid)
        service.register(service.uid);

    });

    push.on('notification', function (data) {
      if( ionic.Platform.platform() == "ios" && data.additionalData.foreground && data.additionalData.payload.web ) {
        return $message.confirm(data.additionalData.payload.titulo, data.additionalData.payload.mensaje, "Ver", "Cancelar").then(function () {
          cordova.InAppBrowser.open(data.additionalData.payload.webpage, "_system");
          if(service.uid)
            $mocifire.set(['users', service.uid, 'beacons', '_clicks', data.additionalData.payload.tipo], true);
        });
      } else if (data.additionalData.foreground) {
        return;
      }

      if(data.additionalData.payload && data.additionalData.payload.state) {
        if(data.additionalData.payload.params)
          $state.go(data.additionalData.payload.state, data.additionalData.payload.params);
        else
          $state.go(data.additionalData.payload.state);
      } else if (data.additionalData.payload && data.additionalData.payload.web) {
        cordova.InAppBrowser.open(data.additionalData.payload.webpage, "_system");
        if(service.uid)
            $mocifire.set(['users', service.uid, 'beacons', '_clicks', data.additionalData.payload.tipo], true);
      }
    });
  }

  service.register = function (uid) {
    service.uid = uid;
    if (push && push.token)
      $mocifire.set(['users', uid, 'push'], {type: ionic.Platform.platform(), token: push.token});
  }
  
  function string2int (string) {
    var num = 0;
    for (var i = 0; i < string.length; i++) {
      num += string.charCodeAt(i);
    }
    return num;
  }
  
  // $push.reminder(id, message, date);
  service.reminder = function (id, message, date) {
    if(! window.cordova) return;
    
    cordova.plugins.notification.local.schedule({
      id: string2int(id),
      title: "Colombia 4.0",
      text: message + ", está a punto de empezar",
      at: date
    });
  };
  
  service.cancelReminder = function (id) {
    if(! window.cordova) return;
    
    cordova.plugins.notification.local.cancel(string2int(id));
  };

  /**
   * $push.send('chat', 49);
   * @param {type} type 'chat' - 'request' - 'answer'
   * @param {type} name Name
   * @param {type} id_receiver Identification of user reciever.
   */
  service.send = function (type, name, id_receiver) {
    $http.post('http://dev.mocionsoft.com:6479/to', {type: type, id: id_receiver, name: name});
  }

});
