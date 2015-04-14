/*global angular*/
angular.module('replenishment').filter('divisionName', function () {
    'use strict';
    
    return function (products) {
        var i = 0,
            name = '';
        
        if (products) {
            for (i = 0; i < products.length; i += 1) {
				if (!name && products[i].structure) {
					name = products[i].structure.division.name;
				}
                
                if (products[i].structure && name !== products[i].structure.division.name) {
                    name = 'Várias';
                    break;
                }
            }
        }
        
        return name;
    };
});