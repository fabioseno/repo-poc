/*global angular*/
angular.module('replenishment').service('userManager', ['localStorageProxy', function userManager(localStorageProxy) {
	'use strict';

	var self = this;

	self.roles = {
		salesAssistant: {
			id: 'sales-assistant',
			name: 'Assistente de vendas'
		},
		stockAssistant: {
			id: 'stock-assistant',
			name: 'Auxiliar de estoque'
		},
		storeManager: {
			id: 'store-manager',
			name: 'Gerente de loja'
		}
	};
	
	self.canCreateRequests = function () {
		return (self.getUserRole().id === self.roles.salesAssistant.id);
	};

	self.getUserRole = function () {
		return localStorageProxy.get('USER_ROLE');
	};
    
    self.getUserLogin = function () {
        return localStorageProxy.get('USER_LOGIN');
	};
    
    self.getUserName = function () {
		return localStorageProxy.get('USER_NAME');
	};
}]);