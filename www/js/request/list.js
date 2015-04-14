/*global angular*/
(function () {
	'use strict';

	function RequestList($scope, $location, requestManager, userManager, toaster) {
		var vm = this;

		vm.goTo = function (path) {
			$location.url(path);
		};
        
        vm.bindStatusList = function () {
            vm.statusList = requestManager.getStatusList();
        };

        vm.getFilters = function () {
			vm.search = requestManager.getFilters();
		};
        
		vm.loadRequests = function () {
			vm.requests = requestManager.getList();
			$scope.$broadcast('scroll.refreshComplete');
		};
		
		vm.canCreateRequests = function () {
			return (userManager.canCreateRequests());
		};
        
        vm.getSort = function () {
            if (userManager.getUserRole().id === userManager.roles.stockAssistant.id) {
                return ['status.stockAssistantPriority', 'relevantDate'];
            } else {
                return ['status.salesAssistantPriority', 'relevantDate'];
            }
        };
        
        $scope.$watch('vm.search', function (value) {
            requestManager.saveFilter(value);
        }, true);

        vm.getFilters();
		vm.bindStatusList();
        vm.loadRequests();
	}

	RequestList.$inject = ['$scope', '$location', 'requestManager', 'userManager', 'toaster'];

	angular.module('replenishment').controller('requestList', RequestList);

}());