/*global angular*/
(function () {
    'use strict';

    function ProductList($location, $stateParams, productManager) {
        var vm = this;

        vm.loadProducts = function () {
            vm.products = productManager.getProducts();
        };

        vm.goBack = function () {
            var url = '';

            if ($location.search().id) {
                url += '/request/' + $location.search().id;
                
                if ($location.search().sku) {
                    url += '/product/' + $location.search().sku;
                }
            } else {
                url = '/requests';
            }
            
            $location.path(url);
        };
        
        vm.selectProduct = function (sku) {
            var url = '';
            
            if ($location.search().id) {
                url += '/request/' + $location.search().id;
                
                if ($location.search().sku) {
                    url += '/product/' + $location.search().sku;
                } else {
                    url += '/products/new';
                }
            } else {
                url = '/requests/new';
            }
            
            url += '?sku=' + sku;
            
            $location.url(url);
        };

        vm.loadProducts();
    }

    ProductList.$inject = ['$location', '$stateParams', 'productManager'];

    angular.module('replenishment').controller('productList', ProductList);

}());