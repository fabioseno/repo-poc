/*global angular*/
(function () {
	'use strict';

	function RequestDetails($location, $state, $stateParams, requestManager, toaster) {
		var vm = this;

		vm.loadRequest = function (requestId, openProductDetails) {
			vm.request = requestManager.load(requestId);

            if (vm.request) {
                vm.updateStatusButtonLabel = requestManager.getNextStatusAction(vm.request.status);

                if (openProductDetails && vm.request.products.length === 0) {
                    $state.go('app.tab.products-new'); // repensar
                }
            }
		};

		vm.changeStatus = function () {
			navigator.notification.confirm('Confirma operação?', function (buttonIndex) {
				if (buttonIndex === 1) {
					requestManager.moveToNextStatus(vm.request);

					toaster.show('Tarefa concluída com sucesso!');
					$state.go('app.tab.requests');
				}
			}, 'Concluir tarefa');
		};

		vm.canDelete = function (request) {
			return requestManager.canDelete(request);
		};

		vm.deleteRequest = function () {
			navigator.notification.confirm('Deseja excluir a solicitação?', function (buttonIndex) {
				if (buttonIndex === 1) {
					requestManager.deleteRequest(vm.request.id);
					$state.go('app.tab.requests');

					toaster.show('Solicitação excluída com sucesso!');
				}
			}, 'Excluir solicitação');
		};
        
        vm.viewProduct = function (requestId, productId) {
            $location.path('/request/' + requestId + '/product/' + productId);
        };

		vm.enableStatusButton = function () {
			return (vm.request.products.length > 0 && vm.request.status !== requestManager.status.finished);
		};

		vm.canEdit = function () {
			return requestManager.canEdit(vm.request);
		};
        
        vm.goBack = function () {
            $location.path('/requests');
        };
		
		vm.addProduct = function () {
			if (!vm.request) {
				$location.path('/requests/new');
			} else {
				$location.path('/request/' + vm.request.id + '/products/new');
			}
		};

		vm.loadRequest($stateParams.id, true);
	}

	RequestDetails.$inject = ['$location', '$state', '$stateParams', 'requestManager', 'toaster'];

	angular.module('replenishment').controller('requestDetails', RequestDetails);

}());