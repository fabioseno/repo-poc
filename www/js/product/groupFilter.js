/*global angular*/
angular.module('replenishment').filter('groupName', function () {
    'use strict';
    
    return function (products) {
        var i = 0,
            group = '';
        
        if (products) {
            for (i = 0; i < products.length; i += 1) {
                group = products[i].structure.group;
                
                if (group && group !== products[i].structure.group.name) {
                    group = 'Várias';
                    break;
                }
            }
        }
        
        return group;
        
    };
});