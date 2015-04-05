/*global angular*/
angular.module('replenishment').filter('groupName', function () {
    'use strict';
    
    return function (products) {
        var i = 0,
            name = '';
        
        if (products) {
            for (i = 0; i < products.length; i += 1) {
				if (!name) {
					name = products[i].structure.group.name;
				}
				
                if (name !== products[i].structure.group.name) {
                    name = 'Várias';
                    break;
                }
            }
        }
        
        return name;
    };
});