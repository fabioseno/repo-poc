/*global angular*/
angular.module('replenishment').filter('divisionName', function () {
    'use strict';
    
    return function (products) {
        var i = 0,
            division = '';
        
        if (products) {
            for (i = 0; i < products.length; i += 1) {
                division = products[i].structure.division;
                
                if (division && division !== products[i].structure.division.name) {
                    division = 'Várias';
                    break;
                }
            }
        }
        
        return division;
        
    };
});