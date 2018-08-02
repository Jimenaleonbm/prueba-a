'use strict';
var net = angular.module('networking', [
	'ionic',
	'ngCordova',
	'ui.router',
	// TODO: load other modules selected during generation
])
net.config(function ($stateProvider) {

	// ROUTING with ui.router
	var SP = $stateProvider;
	// this state is placed in the <ion-nav-view> in the index.html
	SP.state('main.networking', {
		url: '/networking',
		abstract: true,
		views: {
			'eventView':{
				templateUrl: 'networking/templates/tabs.html'
			}
		}
	});

	/**
  	* Attendees:
  	* List of users attending this event
  	*/
	SP.state('main.networking.attendees', {
		url: '/attendees',
		views: {
			'attendees': {
				templateUrl: 'networking/templates/attendees.html',
				controller: 'AttendeesCtrl as ctrl'
			}
		}
	});

	SP.state('main.networking.attendeeCardDetail', {
		url: '/attendee-card-detail/{contactID}',
		views: {
			'attendees': {
				templateUrl: 'networking/templates/mycards-detail.html',
				controller: 'MycardsDetailCtrl as ctrl'
			}
		}
	});

	/**
  	* Business card exchange:
  	* The current user card
  	* The current users contacts & requests
  	*/
	SP.state('main.networking.card', {
		url: '/card',
		views: {
			'card': {
				templateUrl: 'networking/templates/card.html',
				controller: 'CardCtrl as ctrl'
			}
		}
	});

	SP.state('main.networking.mycards', {
		url: '/mycards',
		views: {
			'mycards': {
				templateUrl: 'networking/templates/mycards.html',
				controller: 'MycardsCtrl as ctrl'
			}
		}
	});

	SP.state('main.networking.mycardsDetail', {
		url: '/mycards-detail/{contactID}',
		views: {
			'mycards': {
				templateUrl: 'networking/templates/mycards-detail.html',
				controller: 'MycardsDetailCtrl as ctrl'
			}
		}
	});

	SP.state('main.networking.chatDetail', {
		url: '/chat/{chatID}',
		views: {
			'mycards': {
				templateUrl: 'networking/templates/chat.html',
				controller: 'ChatCtrl as ctrl'
			}
		}
	});

	/**
  * Chats
  */
	SP.state('chats', {
		url: '/chats',
		parent: 'main.networking',
		views: {
			'chats@main.networking': {
				templateUrl: 'networking/templates/chats.html',
				controller: 'ChatsCtrl as ctrl'
			}
		}
	});

	SP.state('chats.chat', {
		url: '/chat/{chatID}',
		views: {
			'chats@main.networking': {
				templateUrl: 'networking/templates/chat.html',
				controller: 'ChatCtrl as ctrl'
			}
		}
	});

	/**
  * Chats
  SP.state('main.networking.chats', {
    url: '/chats',
    views: {
      'chats': {
        templateUrl: 'networking/templates/chats.html',
        controller: 'ChatsCtrl as ctrl'
      }
    }
  });

  SP.state('main.networking.chat', {
    url: '/chat/{chatID}',
    views: {
      'chats@main.networking': {
        templateUrl: 'networking/templates/chat.html',
        controller: 'ChatCtrl as ctrl'
      }
    }
  });
  */

});
