/*global angular*/
(function () {
	'use strict';

	function RequestList($scope, $location, requestManager, userManager) {
		var vm = this;
        
        vm.showFilter = false;
        vm.statusList = requestManager.getStatusList();
        vm.search = requestManager.getFilters();
        
		vm.goTo = function (path) {
			$location.url(path);
		};
        
        vm.isFinished = function () {
            return (!vm.request || (vm.request && vm.request.status.id === requestManager.status.finished.id));
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

        vm.loadRequests();
	}

	RequestList.$inject = ['$scope', '$location', 'requestManager', 'userManager'];

	angular.module('replenishment').controller('requestList', RequestList);

}());