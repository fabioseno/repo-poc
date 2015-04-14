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

        vm.isDraft = function () {
            return (!vm.request || (vm.request && vm.request.status === requestManager.status.draft.name));
        };

        vm.isPending = function () {
            return (!vm.request || (vm.request && vm.request.status === requestManager.status.pending.name));
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
            if (vm.product.sku && vm.product.quantity === 0) {
                requestManager.removeProduct(vm.request, { sku: $stateParams.sku });
            } else {
                if (vm.request && vm.product.sku !== $stateParams.sku) {
                    requestManager.removeProduct(vm.request, { sku: $stateParams.sku });
                }

                vm.request = requestManager.saveProduct(vm.request, vm.product);
            }

            if (vm.request) {
                vm.product = {};
                $location.url('/request/' + vm.request.id);
            }
        };

        vm.selectProduct = function () {
            var url = '/product/list';

            if (vm.request && vm.request.id) {
                url += '?id=' + vm.request.id;

                if ($stateParams.sku) {
                    url += '&sku=' + $stateParams.sku;
                }
            }

            $location.url(url);
        };

        vm.goBack = function () {
            vm.product = {};

            if (vm.request) {
                $location.url('/request/' + vm.request.id);
            } else {
                $location.url('/requests');
            }
        };

        vm.removeProduct = function () {
            //            navigator.notification.confirm('Deseja remover o produto?', function (buttonIndex) {
            //                if (buttonIndex === 1) {
            requestManager.removeProduct(vm.request, vm.product);

            toaster.show('Produto removido com sucesso!');

            if (vm.request) {
                $location.path('/request/' + vm.request.id);
            } else {
                $location.path('/requests');
            }
            //                }
            //            }, 'Remover produto');
        };

        vm.request = requestManager.load($stateParams.id);

        if ($stateParams.sku) {
            vm.product = requestManager.getProduct(vm.request, $stateParams.sku);
        }

        if ($location.search().sku) {
            vm.product.sku = $location.search().sku;
            vm.findByChildId();
        }
    }

    ProductDetails.$inject = ['$location', '$stateParams', 'requestManager', 'productManager', 'toaster'];

    angular.module('replenishment').controller('productDetails', ProductDetails);

}());