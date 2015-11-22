/*global angular*/
angular.module('replenishment').filter('productCodeHighlight', function () {
    'use strict';
    
    return function (code) {
        var i = 0,
            name = '';
        
        if (code && code.length >= 3) {
            name = code.substring(0, code.length - 3) + '<span class="code-highlight">' + code.substring(code.length - 3) + 'P</span>';
        }
        
        return name;
    };
});