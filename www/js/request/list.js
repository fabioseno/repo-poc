/*global angular*/
(function () {
	'use strict';

	function RequestList($scope, $location, requestManager, userManager, toaster) {
		var vm = this;

		vm.goTo = function (path) {
			$location.path(path);
		};

		vm.loadRequests = function () {
			vm.requests = requestManager.getList();
			$scope.$broadcast('scroll.refreshComplete');
		};
		
		vm.canCreateRequests = function () {
			return (userManager.canCreateRequests());
		};

		vm.loadRequests();

		if (userManager.getUserRole().id === 'sales-assistant') {
			vm.search = vm.search || {};
			vm.search.createdBy = userManager.getUserLogin();
		}
	}

	RequestList.$inject = ['$scope', '$location', 'requestManager', 'userManager', 'toaster'];

	angular.module('replenishment').controller('requestList', RequestList);

}());