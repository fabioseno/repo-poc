/*global angular*/
(function () {
    'use strict';

    function ProductDetails($scope, $location, $stateParams, requestManager, productManager, toaster) {
        var vm = this;

        vm.product = {};
        vm.selectedSku = {};
        vm.availableColors = [];
        vm.availableScents = [];

        vm.canEdit = function () {
            return requestManager.canEdit(vm.request);
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

        vm.findByParentId = function () {
            var attributes = {
                    color: vm.selectedSku.color,
                    size: vm.selectedSku.size,
                    scent: vm.selectedSku.scent
                },
                product = productManager.findByParentId(vm.product.productCode, attributes),
                size,
                i;

            product.quantity = vm.product.quantity;

            vm.product = product;

            if (product.sku) {
                if (product.color) {
                    vm.selectedSku.color = product.color.id;
                } else {
                    vm.selectedSku.color = undefined;
                }

                vm.selectedSku.size = product.size;
                vm.selectedSku.scent = product.scent;
            }
            
            for (i = 0; i < product.sizes.length; i += 1) {
                size = product.sizes[i];

                if (size.disabled && size.name === vm.selectedSku.size) {
                    vm.selectedSku.size = undefined;
                    
                    if (product.sizes.length > 0) {
                        vm.selectedSku.size = product.sizes[0].name;
                        vm.findByParentId();
                    }
                    
                    break;
                }
            }
        };

        vm.findByChildId = function () {
            var product = productManager.findBySku(vm.product.sku);
            product.quantity = vm.product.quantity;

            vm.product = product;
            vm.selectedSku.color = product.color.id;
            vm.selectedSku.size = product.size;
            vm.selectedSku.scent = product.scent;
        };

        vm.selectAttribute = function (type, id, disabled) {
            if (!disabled) {
                switch (type) {
                case 'color':
                    vm.selectedSku.color = id;
                    break;
                case 'size':
                    vm.selectedSku.size = id;
                    break;
                case 'scent':
                    vm.selectedSku.scent = id;
                    break;
                }

                vm.findByParentId();
            }
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
            navigator.notification.confirm('Deseja remover o produto?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    $scope.$apply(function () {
                        requestManager.removeProduct(vm.request, vm.product);

                        toaster.show('Produto removido com sucesso!');

                        if (vm.request) {
                            $location.path('/request/' + vm.request.id);
                        } else {
                            $location.path('/requests');
                        }
                    });
                }
            }, 'Remover produto');
        };

        vm.request = requestManager.load($stateParams.id);

        if ($stateParams.sku) {
            vm.product = requestManager.getProduct(vm.request, $stateParams.sku);
            vm.selectedSku.color = vm.product.color.id;
            vm.selectedSku.size = vm.product.size;
            vm.selectedSku.scent = vm.product.scent;
        }

        if ($location.search().sku) {
            vm.product.sku = $location.search().sku;
            vm.findByChildId();
        }
    }

    ProductDetails.$inject = ['$scope', '$location', '$stateParams', 'requestManager', 'productManager', 'toaster'];

    angular.module('replenishment').controller('productDetails', ProductDetails);

}());