'use strict';
angular.module('wall', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider) {

    // ROUTING with ui.router
    var SP = $stateProvider;
    // this state is placed in the <ion-nav-view> in the index.html
    SP.state('main.wall', {
      url: '/wall',
      views: {
        'eventView': {
          templateUrl: 'wall/templates/list.html',
          controller: 'ListCtrl as ctrl'
        }
      }
    });

    SP.state('main.post', {
      url: '/post',
      views: {
        'eventView': {
          templateUrl: 'wall/templates/post.html',
          controller: 'PostCtrl as ctrl'
        }
      }
    });

    SP.state('main.postEdit', {
      url: '/postEdit',
      views: {
        'eventView': {
          templateUrl: 'wall/templates/post.html',
          controller: 'PostCtrl as ctrl'
        }
      }
    });

    SP.state('main.edit_comments', {
      url: '/Edit',
      views: {
        'eventView': {
          templateUrl: 'wall/templates/edit.html',
          controller: 'EditCtrl as ctrl'
        }
      }
    });

    SP.state('main.post_comments', {
      url: '/post-comments',
      params: {
        focus: null,
        post_id: null
      },
      views: {
        'eventView': {
          templateUrl: 'wall/templates/post-comments.html',
          controller: 'PostCommentsCtrl as ctrl'
        }
      }
    });

  });
