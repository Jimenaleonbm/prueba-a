'use strict';
angular.module('networking')

	.directive('clickForOptions', ['$log','$ionicGesture', function($log, $ionicGesture) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function (e) {
					e.stopPropagation();

					// Grab the content
					var content = element.parent()[0];

					// Grab the buttons and their width
					var buttons = element.parent().parent()[0].querySelector('.item-options');

					if (!buttons) {
						console.log('There are no option buttons');
						return;
					}
					var buttonsWidth = buttons.offsetWidth;

					ionic.requestAnimationFrame(function() {
						content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

						if (!buttons.classList.contains('invisible')) {
							// Hide options
							element.removeClass('ion-ios-close-outline');
							element.addClass('ion-android-more-vertical');
							content.style[ionic.CSS.TRANSFORM] = '';
							setTimeout(function() {
								buttons.classList.add('invisible');
							}, 250);
						} else {
							// Show options
							element.removeClass('ion-android-more-vertical');
							element.addClass('ion-ios-close-outline');
							buttons.classList.remove('invisible');
							content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
						}
					});
				});
			}
		};
	}])
