/*global angular*/
angular.module('replenishment').service('toaster', ['$ionicLoading', function ($ionicLoading) {
	'use strict';

	this.show = function (message) {
		$ionicLoading.show({
			template: message,
			noBackdrop: true,
			duration: 1500
		});
	};
}]);