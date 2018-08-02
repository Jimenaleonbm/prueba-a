'use strict';
angular.module('wall')
    .controller('PostCtrl', function ($mocifire, $user, $scope, $timeout, $ionicHistory, $camera, $profileimage, $ionicLoading, event_id) {

        var ctrl = this;

        ctrl.user = $user;

        /**
         * autofocus textarea
         */
        $timeout(function () {
            var elem = angular.element(document.getElementById('post_edit'));
            elem[0].focus();
        }, 10);

        /**
         * Camara
         */
        ctrl.image = {};
        ctrl.changeImage = function (library) {
            $camera.get(library).then(function (blop) {
                ctrl.image.change = true;
                ctrl.image.blop = blop;
                ctrl.image.url = URL.createObjectURL(blop);
            });
        };

        ctrl.clearImage = function () {
            ctrl.image = {};
        };


        var wallRef = firebase.database().ref('wall').child(event_id);
        var wallQuery = wallRef.orderByChild('date');

        wallQuery.on('value', function (list) {
          ctrl.list = $filter('orderBy')( $filter('toArray')(list.val(), true), 'date', true );
          ctrl.userid = ctrl.user.uid;

          ctrl.comment = ctrl.list[0].comment;
          for(var i=0; i<ctrl.list.length; i++){
          if(ctrl.userid==ctrl.list[i].user.id){
          ctrl.comment = ctrl.list[i].comment;
          ctrl.userActual = ctrl.list[i].user.id;
          }
          }
          console.log("list ", ctrl.list, ctrl.user);
          $commons.apply($scope);
        });


        /**
         * crear nuevo post
         * @param comment
         */
        $scope.form = {};
        ctrl.push = function (comment) {

            if (!comment) return;


            if (ctrl.image.change && ctrl.image.blop) {

                $ionicLoading.show({
                    template: 'Subiendo imagen ...'
                });

                $profileimage.upload(ctrl.image.blop).then(function (imageUrl) {
                    sendData(comment, imageUrl);
                });
            } else {
                sendData(comment);
            }
        };


        var sendData = function (comment, imageUrl) {
            var message = {
                date: firebase.database.ServerValue.TIMESTAMP,
                comment: comment,
                image: imageUrl || null,
                status: false,
                user: {
                    id: $user.uid,
                    name: $user.name || 'usuario anonimo',
                    image: $user.image || null
                }
            };

            $mocifire.push(['wall', event_id], message).then(function (post_id) {
                // Guardar referencia de los post del usuario
                $mocifire.set(['users_post', $user.uid, post_id], true);
            });
            
            $scope.form = {};

            $ionicLoading.hide();
            $ionicHistory.goBack();
        }

    });
