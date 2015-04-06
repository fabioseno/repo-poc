/*global angular*/
(function () {
	'use strict';

	function RequestDetails($location, $state, $stateParams, requestManager, productManager, toaster) {
		var vm = this;

        vm.loadRequest = function (id, openProductDetails) {
			vm.request = requestManager.load(id);

            if (vm.request) {
                vm.updateStatusButtonLabel = requestManager.getNextStatusAction(vm.request.status);
            }
		};

		vm.changeStatus = function () {
			navigator.notification.confirm('Confirma operação?', function (buttonIndex) {
				if (buttonIndex === 1) {
					requestManager.moveToNextStatus(vm.request);

                    if (vm.request.status !== requestManager.status.pending) {
                        toaster.show('Tarefa concluída com sucesso!');
                        $state.go('app.tab.requests');
                    } else {
                        vm.loadRequest(vm.request.id, false);
                        toaster.show('Separação iniciada!');
                    }
				}
			}, 'Concluir tarefa');
		};
        
        vm.getStatus = function (product) {
            return productManager.getStatus(product);
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
            return requestManager.canChangeStatus(vm.request);
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

	RequestDetails.$inject = ['$location', '$state', '$stateParams', 'requestManager', 'productManager', 'toaster'];

	angular.module('replenishment').controller('requestDetails', RequestDetails);

}());