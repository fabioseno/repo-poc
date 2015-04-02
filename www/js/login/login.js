/*global angular*/
(function () {
	'use strict';

	function Login($state, localStorageProxy, toaster, users) {
		var vm = this,
			user;

		vm.signin = function () {
			if (vm.loginForm.$valid) {
				var i, found = false;
				
				for (i = 0; i < users.length; i += 1) {
					user = users[i];
						
					if (user.login === vm.login) {
						found = true;
						localStorageProxy.add('USER_LOGIN', user.login);
						localStorageProxy.add('USER_ROLE', user.role);
						
                        break;
					}
				}
				
				if (!found) {
					toaster.show('Login/senha inválido!');
				} else {
                    $state.go('app.tab.requests');

					toaster.show('Bem-vindo, ' + vm.login);
                }
			}
		};
	}

	Login.$inject = ['$state', 'localStorageProxy', 'toaster', 'userData'];

	angular.module('replenishment').controller('login', Login);

}());