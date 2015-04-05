/*global angular*/
(function () {
    'use strict';

    function ProductDetails($location, $stateParams, requestManager, productManager, toaster) {
        var vm = this;

        vm.product = {};
        
        vm.canEdit = function () {
			return requestManager.canEdit(vm.request);
		};
        
        vm.canExecute = function () {
			return requestManager.canExecute(vm.request);
		};
        
        vm.findByParentId = function () {
            var products = productManager.findByParentId(vm.product.parentId);
        };

        vm.findByChildId = function () {
            var product = productManager.findBySku(vm.product.sku);
            product.quantity = vm.product.quantity;

            vm.product = product;
        };

        vm.save = function () {
            vm.request = requestManager.saveProduct(vm.request, vm.product);

            if (vm.request) {
                vm.product = {};
                $location.path('/request/' + vm.request.id);
            }
        };

        vm.goBack = function () {
            vm.product = {};

            if (vm.request) {
                $location.path('/request/' + vm.request.id);
            } else {
                $location.path('/requests');
            }
        };

        vm.removeProduct = function () {
            navigator.notification.confirm('Deseja remover o produto?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    requestManager.removeProduct(vm.request, vm.product);

                    toaster.show('Produto removido com sucesso!');
                    
                    if (vm.request) {
                        $location.path('/request/' + vm.request.id);
                    } else {
                        $location.path('/requests');
                    }
                }
            }, 'Remover produto');
        };

        vm.request = requestManager.load($stateParams.id);

        if ($stateParams.sku) {
            vm.product = requestManager.getProduct(vm.request, $stateParams.sku);
        }
    }

    ProductDetails.$inject = ['$location', '$stateParams', 'requestManager', 'productManager', 'toaster'];

    angular.module('replenishment').controller('productDetails', ProductDetails);

}());