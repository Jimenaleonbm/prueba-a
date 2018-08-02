'use strict';
angular.module('news').controller('NoticeCtrl', function ($scope, $stateParams, $log) {

  $scope.notice = $stateParams.notice;


  var ctrl = this;
  $scope.shareFaceBook = function () {
      ctrl.imagenData = ctrl.getBase64Image(document.getElementById("imageid"));
      console.log('Facebook Sharing...');
      window.plugins.socialsharing.shareViaFacebook(ctrl.msg, 'data:image/png;base64,'+ctrl.imagenData, function() {console.log('share ok')}, function(errormsg){console.log(errormsg)});
      //share(message, subject, file, url)
  };
  $scope.shareInstagram = function () {
      ctrl.imagenData = ctrl.getBase64Image(document.getElementById("imageid"));
      console.log('Instagram Sharing...');
      // console.log($scope.event.slider[0].url);
      window.plugins.socialsharing.shareViaInstagram(ctrl.msg, 'data:image/png;base64,'+ctrl.imagenData, function() {console.log('share ok')}, function(errormsg){console.log(errormsg)});
      //share(message, subject, file, url)
  };
  ctrl.getBase64Image = function (img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

});
