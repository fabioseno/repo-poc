/*global angular, cordova, StatusBar*/
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('replenishment', ['ionic', 'wt-core']).run(
	function ($ionicPlatform) {
		'use strict';

		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	}
).config(function ($stateProvider, $urlRouterProvider) {
	'use strict';

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: 'js/login/login.html',
		controller: 'login',
		controllerAs: 'vm'
	}).state('app', {
		url: '',
		abstract: true,
		templateUrl: 'js/container/logged-container.html'
	}).state('app.tab', {
		url: '',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	}).state('app.tab.requests', {
		url: '/requests',
		views: {
			'tab-requests': {
				templateUrl: 'js/request/list.html',
				controller: 'requestList as vm'
			}
		}
	}).state('app.tab.requests-new', {
		url: '/requests/new',
		views: {
			'tab-requests': {
				templateUrl: 'js/product/details.html',
				controller: 'productDetails as vm'
			}
		}
	}).state('app.tab.request-detail', {
		url: '/request/:id',
		views: {
			'tab-requests': {
				templateUrl: 'js/request/details.html',
				controller: 'requestDetails as vm'
			}
		}
	}).state('app.tab.products-new', {
		url: '/request/:id/products/new',
		views: {
			'tab-requests': {
				templateUrl: 'js/product/details.html',
				controller: 'productDetails as vm'
			}
		}
	}).state('app.tab.product-detail', {
		url: '/request/:id/product/:sku',
		views: {
			'tab-requests': {
				templateUrl: 'js/product/details.html',
				controller: 'productDetails as vm'
			}
		}
	}).state('app.tab.setup', {
		url: '/setup',
		views: {
			'tab-setup': {
				templateUrl: 'js/setup/setup.html'
			}
		}
	}).state('app.tab.test-products', {
		url: '/setup/test-products',
		views: {
			'tab-chats': {
				templateUrl: 'js/setup/products.html',
				controller: 'setupData'
			}
		}
	}).state('app.tab.settings', {
		url: '/settings',
		views: {
			'tab-settings': {
				templateUrl: 'js/settings/settings.html',
				controller: 'settings as vm'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');

});
