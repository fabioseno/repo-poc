/*global angular*/
(function () {
    'use strict';

    function ProductList($location, $stateParams, productManager) {
        var vm = this;

        vm.loadProducts = function () {
            vm.products = productManager.getProducts();
        };
        
        vm.getDivisions = function () {
            var divisions = [],
                products = productManager.getProducts(),
                found = false,
                i,
                j;
            
            for (i = 0; i < products.length; i += 1) {
                found = false;
                
                for (j = 0; j < divisions.length; j += 1) {
                    if (products[i].structure.division.name === divisions[j].name) {
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    divisions.push(products[i].structure.division);
                }
            }
            
            vm.divisions = divisions;
            vm.loadProducts();
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

        vm.getDivisions();
    }

    ProductList.$inject = ['$location', '$stateParams', 'productManager'];

    angular.module('replenishment').controller('productList', ProductList);

}());