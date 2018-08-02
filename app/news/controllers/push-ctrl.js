'use strict';
angular.module('news').controller('PushCtrl', function ($scope, $mocifire) {

  $mocifire.on("notifications", function (notifications) {
    $scope.notifications = notifications;
  });

});
