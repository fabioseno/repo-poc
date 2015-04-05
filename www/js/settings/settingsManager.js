/*global angular*/
angular.module('replenishment').service('settingsManager', ['localStorageProxy', function (localStorageProxy) {
	'use strict';

	var self = this;
    
    self.settings = {
        useEcommerceName: 'CONFIG_USE_ECOMMERCE_NAME',
        showPictures: 'CONFIG_SHOW_PICTURES',
        onlinePictures: 'CONFIG_ONLINE_PICTURES'
    };
	
    self.getValue = function (name) {
        return localStorageProxy.get(name);
    };
    
    self.setValue = function (name, value) {
        localStorageProxy.add(name, value);
    };
    
}]);