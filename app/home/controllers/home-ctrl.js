'use strict';
angular.module('home')
    .controller('HomeCtrl', function ($log, $scope, $mocifire, $commons, $filter, $user, $q, $CurrentSession, $state, $ionicNavBarDelegate, _logo, event_id, $ionicHistory, $fav,
      $ionicScrollDelegate, $message, $window) {

        var ctrl = this;
        ctrl.user = $user;

        if (!event_id)
            return $state.go('landing');

        /**
         * Scroll init
         */
        var HomeScroll = $ionicScrollDelegate.$getByHandle('HomeScroll');

        /**
         * init
         * @type {*}
         */
        $scope.event_id = event_id;
        $scope.TheTime = {};

        $scope.agenda = {
            loaded: false,
            data: []
        };

        $mocifire.on(['events', event_id, 'info'], function (data) {
            if (!data) return;
            $scope.event = data;
            ctrl.msg = $scope.event.name+' \n Ciudad: '+$scope.event.city+'\n Lugar: '+$scope.event.place+' \n'+$scope.event.dateFrom;
            console.log(data);
            $commons.apply($scope);
            HomeScroll.resize();
        });

        /*$mocifire.on(['events', event_id, 'content'], function (data) {
         console.info(data);
         if (!data) return;
         $scope.content = data;
         $commons.apply($scope);
         HomeScroll.resize();
         });*/

        $mocifire.on(['events', event_id, 'contenido'], function (data) {
            $scope.content = data;
            console.log($scope.content);
        });

        /**
         * Social sharing
         */
        // share anywhere
       /* $scope.share = function () {
            console.log('Sharing...');
            // window.plugins.socialsharing.share($scope.event.name, $scope.event.place, $scope.event.slider[0], $scope.event.tickets, onSuccess, onError);
            window.plugins.socialsharing.share(ctrl.msg, null, 'data:image/png;base64,'+ctrl.imagenData, $scope.event.tickets);
            //share(message, subject, file, url)
        };*/
        $scope.shareFaceBook = function () {
            ctrl.imagenData = ctrl.getBase64Image(document.getElementById("imageid"));
            console.log('Facebook Sharing...');
            window.plugins.socialsharing.share(ctrl.msg, 'data:image/png;base64,'+ctrl.imagenData, null,
            function() {console.log('share ok')}, 
            function(errormsg){
                console.log(errormsg);

        });
    }

        $scope.shareInstagram = function () {
            ctrl.imagenData = ctrl.getBase64Image(document.getElementById("imageid"));
            console.log('Instagram Sharing...');
            // console.log($scope.event.slider[0].url);
            window.plugins.socialsharing.share(ctrl.msg, 'data:image/png;base64,'+ctrl.imagenData, null,
            function() {console.log('share ok')}, 
            function(errormsg){
                console.log(errormsg);
        });
  
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

        /**
         * Abrir link externo
         * @param path
         */
        $scope.link = function (path) {
            cordova.InAppBrowser.open(path, '_system', 'location=yes');
        };
        $scope.foo = function() {
            $window.open('//moveconcerts.com/');
            //$window.open(url, windowName, attributes);
        };

        //Ir a faq de evento
        ctrl.goToFaq = function() {

          $state.go('global.faqs',
            {
              //eventId:ctrl.currentEvent,
              //sessionId:ctrl.currentSession
            });
        }

        /**
         * navegar a otro estado
         * @param state
         * @param disableBack
         */
        $scope.goTo = function (state, disableBack) {
            $ionicHistory.nextViewOptions({
                disableBack: disableBack || false
            });
            $state.go(state);
        };
        $scope.footerGo = function (state) {
            if(ctrl.user.isAnonymous && state !== "global.landing")
                $message.alert('Para disfrutar esta sección tienes que ser un usuario registrado');
            else
                $state.go(state);

        };

        /**
         * Favourites
         * @param check
         */
        $scope.fav = {
            selected: ( $fav.is('events', event_id) )
        };

        $scope.check_fav = function () {
            return $scope.fav.selected;
        };
        $scope.set_fav = function (val) {
            $scope.fav.selected = val;
        };

        $scope.toggle_fav = function (check) {
            if (check) {
                $fav.remove('events', event_id);
                $scope.set_fav(false);
            } else {
                $fav.new('events', event_id);
                $scope.set_fav(true);
            }
        };

        /**
         * contenido dinamico
         */
        var tpls = {
            content: 'home/templates/tpls/content.html',
            video: 'home/templates/tpls/video.html',
            image: 'home/templates/tpls/image.html'
        };

        $scope.get_content_tpl = function (type) {
            return tpls[type];
        };


    })
