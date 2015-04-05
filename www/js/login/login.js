/*global angular*/
(function () {
	'use strict';

	function Login($state, authenticationManager, toaster) {
		var vm = this,
			user;

		vm.signin = function () {
			if (vm.loginForm.$valid) {
				var found = false;
                
                found = authenticationManager.signin(vm.login, vm.password);
				
				if (!found) {
					toaster.show('Login/senha inválido!');
				} else {
                    $state.go('app.tab.requests');

					toaster.show('Bem-vinda(o), ' + vm.login);
                }
			}
		};
	}

	Login.$inject = ['$state', 'authenticationManager', 'toaster'];

	angular.module('replenishment').controller('login', Login);

}());