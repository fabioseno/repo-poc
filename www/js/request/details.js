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

		vm.canDelete = function (request) {
			return requestManager.canDelete(request);
		};

		vm.canExecute = function () {
            return requestManager.canExecute(vm.request);
        };

        vm.isDraft = function () {
            return (!vm.request || (vm.request && vm.request.status.id === requestManager.status.draft.id));
        };
        
        vm.isPending = function () {
            return (!vm.request || (vm.request && vm.request.status.id === requestManager.status.pending.id));
        };

        vm.changeStatus = function () {
//			navigator.notification.confirm('Confirma operação?', function (buttonIndex) {
//				if (buttonIndex === 1) {
            requestManager.moveToNextStatus(vm.request);

            if (vm.request.status.id !== requestManager.status.pending.id) {
                toaster.show('Tarefa concluída com sucesso!');
                $state.go('app.tab.requests');
            } else {
                vm.loadRequest(vm.request.id, false);
                toaster.show('Separação iniciada!');
            }
//				}
//			}, 'Concluir tarefa');
		};
        
        vm.deleteRequest = function () {
//			navigator.notification.confirm('Deseja excluir a solicitação?', function (buttonIndex) {
//				if (buttonIndex === 1) {
            requestManager.deleteRequest(vm.request.id);
            $state.go('app.tab.requests');

            toaster.show('Solicitação excluída com sucesso!');
//				}
//			}, 'Excluir solicitação');
		};
        
        vm.getStatus = function (product) {
            return productManager.getStatus(product);
        };
        
        vm.getColorStatus = function (product) {
            var status = vm.getStatus(product);
            
            switch (status) {
            case 'Separado':
                return 'product-status-attended';
            case 'Parcial':
                return 'product-status-partially-attended';
            default:
                return 'product-status-not-attended';
            }
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
            $location.url('/requests');
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