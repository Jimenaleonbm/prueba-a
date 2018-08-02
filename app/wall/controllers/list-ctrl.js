'use strict';
angular.module('wall')
.controller('ListCtrl', function ($mocifire, $commons, $scope, $user, $filter, event_id) {

  var ctrl = this;

  ctrl.user = $user;
  
  $mocifire.get(['users_likes', $user.uid, 'post_likes']).then(function (likes) {
    ctrl.user_likes = likes;
  });

  var wallRef = firebase.database().ref('wall').child(event_id);
  var wallQuery = wallRef.orderByChild('date');

  wallQuery.on('value', function (list) {
    ctrl.list = $filter('orderBy')( $filter('toArray')(list.val(), true), 'date', true );
    console.log("list ", ctrl.list, ctrl.user);
    $commons.apply($scope);
  });

  /**
   * formato de fecha con moment
   */
  ctrl.getDateFormat = function (date) {
    return moment().to(date);
  };


  ctrl.like = function (post_id) {
    // if (!post_id || ctrl.checkUserPostLike(post_id)) return;
      var commentsRef = firebase.database().ref('wall').child(event_id).child(post_id).child('likes');
      if(ctrl.checkUserPostLike(post_id)){
          /**
           * restar el numero de likes
           */
          commentsRef.transaction(function(current_likes) {
              return current_likes - 1;
          });

          /**
           * guardar en BD
           */
          var userLike = firebase.database().ref('users_likes').child($user.uid).child('post_likes').child(post_id);
          userLike.remove();
          /**
           * actuaizar objeto local
           */
          ctrl.user_likes = ctrl.user_likes || {};
          ctrl.user_likes[post_id] = false;
      }else{
        /**
         * sumar el numero de likes
         */
        commentsRef.transaction(function(current_likes) {
          return current_likes + 1;
        });

        /**
         * guardar en BD
         */
        $mocifire.set(['users_likes', $user.uid, 'post_likes', post_id], true);

        /**
         * actuaizar objeto local
         */
        ctrl.user_likes = ctrl.user_likes || {};
        ctrl.user_likes[post_id] = true;
      }
  };

  /**
   * revisar si el usuario le ha dado like a un post
   * @param post_id
   */
  ctrl.checkUserPostLike = function (post_id) {
    if (!ctrl.user_likes) return false;
    return ctrl.user_likes[post_id];
  };


  ctrl.share = function (image) {
      // console.log(image);
      var msg = 'Message';
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = image;
      img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);

          var dataURL = canvas.toDataURL("image/png");

          ctrl.imagenData = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          console.log(ctrl.imagenData);
          window.plugins.socialsharing.share(msg, null, 'data:image/png;base64,'+ctrl.imagenData, ' ');

      };
      img.remove();
      /*function getBase64Image(img) {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          console.log(ctx);
          var dataURL = canvas.toDataURL("image/png");
          console.log(dataURL);
          return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      }

      ctrl.imagenData = getBase64Image(asd);*/
  }

});
