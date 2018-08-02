angular.module('main').service('$camera', function ($q, $window) {

  var $camera = this;

  /**
   *
   * @param boolean source
   * @param int width
   * @param int height
   * @returns {Item} @return
   */
  $camera.get = function (source, width, height) {
    return $q(function (resolve, reject) {
      if($window.navigator.camera) {
        $window.navigator.camera.getPicture(function (b64Data) {
          resolve($camera.base64toBlob(b64Data));
        }, reject, {
          quality: 100,
          destinationType: $window.navigator.camera.DestinationType.DATA_URL,
          sourceType: (!source) ? $window.navigator.camera.PictureSourceType.CAMERA : $window.navigator.camera.PictureSourceType.PHOTOLIBRARY,
          correctOrientation: true,
          allowEdit: true,
          targetWidth: (width) ? width : 400,
          targetHeight: (height) ? height : 400,
        });
      } else {
        var data64 = "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";
        resolve($camera.base64toBlob(data64, width));
      }
    });
  }

  $camera.base64toBlob = function (b64Data, sliceSize) {
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: "image/jpeg"});
    return blob;
  }

});
