/*global angular*/
angular.module('replenishment').constant('userData', [
	{
		login: 'ana',
		password: 'ana',
		role: {
			id: 'sales-assistant',
			name: 'Assistente de vendas'
		}
	},
	{
		login: 'fabio',
		password: 'fabio',
		role: {
			id: 'stock-assistant',
			name: 'Auxiliar de estoque'
		}
	},
	{
		login: 'fabi',
		password: 'fabi',
		role: {
			id: 'store-manager',
			name: 'Gerente de loja'
		}
	}
]);