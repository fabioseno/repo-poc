/*global angular*/
(function () {
	'use strict';

	function RequestList(requestManager, userManager, toaster) {
		var vm = this;

		vm.showFilters = false;

		vm.loadRequests = function () {
			vm.requests = requestManager.getList();
		};
		
		vm.canSwipe = true;

		vm.canCreateRequests = function () {
			return (userManager.canCreateRequests());
		};

		vm.loadRequests();

		if (userManager.getUserRole().id === 'sales-assistant') {
			vm.search = vm.search || {};
			vm.search.createdBy = userManager.getUserLogin();
		}
	}

	RequestList.$inject = ['requestManager', 'userManager', 'toaster'];

	angular.module('replenishment').controller('requestList', RequestList);

}());