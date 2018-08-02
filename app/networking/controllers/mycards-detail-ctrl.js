'use strict';
var net = angular.module('networking');
net.controller('MycardsDetailCtrl', function ($log, $ionicPopup, $mocifire, $stateParams, $ionicLoading, $timeout, $Contact, $ionicHistory) {

  var ctrl = this;

  $ionicLoading.show();

  ctrl.contact = {};

  /**
  * Metodo: traer usuario
  */
  $mocifire.get('users/' +$stateParams.contactID + '/info').then(function (contact) {
    ctrl.contact.data = contact;
    ctrl.contact.id = $stateParams.contactID;
    $timeout(function() {
      $ionicLoading.hide();
    }, 200);

  });

  /**
  * Metodo para borrar usuario
  */
  ctrl.remove = function () {
    var alert = $ionicPopup.confirm({
      title: 'Por favor confirmar',
      template: 'Desea eliminar este contacto?',
      buttons: [
        {
          text: 'Cancel',
          type: 'button-royal'
        },
        {
          text: 'Ok',
          type: 'button-royal',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            return true;
          }
        }
      ]
    });

    alert.then(function(res) {
      if(res) {
        $log.log('You are sure');
        $Contact.remove($stateParams.contactID).then(function () {
          // User deleted
          $ionicHistory.goBack();
        });
      } else {
        $log.log('You are not sure');
      }

    });
  };

  /**
  * Metodo: agregar contacto a telefono
  */
  ctrl.addToPhone = function() {

    //nuevo objeto contacto
    var contact = navigator.contacts.create();

    //nombre
    var name = new ContactName();
    name.givenName = ctrl.contact.data.name;
    name.familyName = '';
    contact.name = name;

    // store contact phone numbers in ContactField[]
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', ctrl.contact.data.mobilePhone, false);// preferred number
    contact.phoneNumbers = phoneNumbers;

    // store contact organiztions in ContactOrganization[]
    var organizations = [];

    // store contact emails in ContactField[]
    var emails = [];
    emails[0] = new ContactField('work',  ctrl.contact.data.email, false);
    contact.emails = emails;

    // save the contact
    contact.save(onSuccess,onError);
  };

  function onSuccess(contact) {
    $ionicPopup.alert({
      title: 'Contacto Agregado',
      template: 'Puedes cerrar esta ventana!'
    });
  };

  function onError(contactError) {
    $ionicPopup.alert({
      template: 'Error = ' + contactError.code
    });
  };

  /**
  * Metodo: Enviar email a contacto
  */
  ctrl.enviarMail = function(email) {
    cordova.plugins.email.open({
      to:      email,
      cc:      '',
      bcc:     [],
      subject: '',
      body:    ''
    });
  };

});
