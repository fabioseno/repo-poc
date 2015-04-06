/*global angular*/
angular.module('replenishment').constant('userData', [
	{
		login: 'ana',
        name: 'Ana Paula Franciosi',
		password: 'ana',
		role: {
			id: 'sales-assistant',
			name: 'Assistente de vendas'
		}
	},
	{
		login: 'fabio',
        name: 'Fábio Akira Yoshida',
		password: 'fabio',
		role: {
			id: 'stock-assistant',
			name: 'Auxiliar de estoque'
		}
	},
	{
		login: 'fabi',
        name: 'Fabiana Piva Brum',
		password: 'fabi',
		role: {
			id: 'store-manager',
			name: 'Gerente de loja'
		}
	}
]);