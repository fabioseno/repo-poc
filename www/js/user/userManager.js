/*global angular*/
angular.module('replenishment').service('userManager', ['sessionStorageProxy', function userManager(sessionStorageProxy) {
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
		return sessionStorageProxy.get('USER_ROLE');
	};
    
    self.getUserLogin = function () {
        return sessionStorageProxy.get('USER_LOGIN');
	};
    
    self.getUserName = function () {
		return sessionStorageProxy.get('USER_NAME');
	};
}]);