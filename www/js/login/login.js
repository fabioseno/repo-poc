/*global angular*/
(function () {
	'use strict';

	function Login($state, authenticationManager, toaster) {
		var vm = this,
			user;

		vm.signin = function () {
			if (vm.loginForm.$valid) {
				var user;
                
                user = authenticationManager.signin(vm.login, vm.password);
				
				if (!user) {
					toaster.show('Login/senha inválido!');
				} else {
                    $state.go('app.tab.requests');

					toaster.show('Bem-vinda(o), ' + user.name);
                }
			}
		};
	}

	Login.$inject = ['$state', 'authenticationManager', 'toaster'];

	angular.module('replenishment').controller('login', Login);

}());