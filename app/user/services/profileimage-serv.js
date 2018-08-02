'use strict';
angular.module('user')
  .service('$profileimage', function ($log, $q, $user) {

  var serv = this;

  var storageRef = firebase.storage().ref('users');

  serv.update = function (blop) {
    return $q(function (resolve, reject) {
      serv.upload(blop).then(function (data) {
        $log.log('image url', data);
        $user.saveProfile({image: data}).then(function () {
          resolve();
        });
      }).catch(function (err) {
        $log.log('upload error:', err);
        resolve(err);
      });
    });
  };

  serv.upload = function (blop) {
    return $q(function(resolve, reject) {
      var filename = (new Date()).getTime() + ".png";
      var uploadTask = storageRef.child(filename).put(blop);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
      }, function(error) {
        reject(error);
      }, function() {
        resolve(uploadTask.snapshot.downloadURL);
      });
    });
  };

});
