/*global angular*/
angular.module('replenishment').service('settingsManager', ['localStorageProxy', function (localStorageProxy) {
	'use strict';

	var self = this;

	self.settings = {
		useEcommerceNames: 'CONFIG_USE_ECOMMERCE_NAMES',
		showPictures: 'CONFIG_SHOW_PICTURES',
		onlinePictures: 'CONFIG_ONLINE_PICTURES'
	};

	self.getValue = function (name) {
		switch (name) {
		case self.settings.useEcommerceNames:
			return localStorageProxy.get(name) == false ? false : true;
		case self.settings.showPictures:
			return localStorageProxy.get(name) == false ? false : true;
		case self.settings.onlinePictures:
			return localStorageProxy.get(name) == false ? false : true;
		}
	};

	self.setValue = function (name, value) {
		localStorageProxy.add(name, value);
	};

}]);