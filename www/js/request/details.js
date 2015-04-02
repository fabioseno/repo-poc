/*global angular*/
(function () {
	'use strict';

	function RequestDetails($location, $state, $stateParams, $ionicHistory, requestManager, toaster) {
		var vm = this;

		vm.loadRequest = function (requestId, openProductDetails) {
			vm.request = requestManager.load(requestId);

			vm.updateStatusButtonLabel = requestManager.getNextStatusAction(vm.request.status);

			if (openProductDetails && vm.request.products.length === 0) {
				$state.go('app.tab.products-new'); // repensar
			}
		};

		vm.changeStatus = function () {
			navigator.notification.confirm('Confirma operação?', function (buttonIndex) {
				if (buttonIndex === 1) {
					requestManager.moveToNextStatus(vm.request);

					toaster.show('TOASTER.DISPLAY_MESSAGE', 'Tarefa concluída com sucesso!');
					$ionicHistory.goBack();
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
					$ionicHistory.goBack();

					toaster.show('Solicitação excluída com sucesso!');
				}
			}, 'Excluir solicitação');
		};

		vm.enableStatusButton = function () {
			return (vm.request.products.length > 0 && vm.request.status !== requestManager.status.finished);
		};

		vm.canEdit = function () {
			return requestManager.canEdit(vm.request);
		};
		
		vm.addProduct = function () {
			if (!vm.request) {
				$location.path('/requests/new');
			} else {
				$location.path('/request/' + vm.request.id + '/products/new');
			}
		};

		vm.removeProduct = function (product, event) {
			navigator.notification.confirm('Deseja remover o produto?', function (buttonIndex) {
				if (buttonIndex === 1) {
					vm.request = requestManager.removeProduct(vm.request, product);
					vm.loadRequest(vm.request.id, false);

					toaster.show('Produto removido com sucesso!');
				}
			}, 'Remover produto');

			if (event) {
				event.stopPropagation();
				event.preventDefault();
			}
		};

		vm.loadRequest($stateParams.id, true);
	}

	RequestDetails.$inject = ['$location', '$state', '$stateParams', '$ionicHistory', 'requestManager', 'toaster'];

	angular.module('replenishment').controller('requestDetails', RequestDetails);

}());