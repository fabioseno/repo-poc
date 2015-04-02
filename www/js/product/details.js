/*global angular*/
(function () {
	'use strict';

	function ProductDetails($stateParams, $ionicHistory, requestManager, productManager) {
		var vm = this;

		vm.product = {};
		vm.canEdit = true;

		vm.findByParentId = function () {
			var products = productManager.findByParentId(vm.product.parentId);
		};

		vm.findByChildId = function () {
			var product = productManager.findByChildId(vm.product.sku);
			product.quantity = vm.product.quantity;

			vm.product = product;
		};

		vm.save = function () {
			requestManager.saveProduct(vm.request, vm.product);
			vm.product = {};
			$ionicHistory.goBack();
		};

		vm.cancel = function () {
			vm.product = {};
			$ionicHistory.goBack();
		};
		
		vm.request = requestManager.load($stateParams.id) || {};
		
		if ($stateParams.sku) {
			vm.product.sku = $stateParams.sku;
			vm.findByChildId();
		}
	}

	ProductDetails.$inject = ['$stateParams', '$ionicHistory', 'requestManager', 'productManager'];

	angular.module('replenishment').controller('productDetails', ProductDetails);

}());