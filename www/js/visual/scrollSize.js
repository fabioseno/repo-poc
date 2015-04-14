/*global angular*/
angular.module('replenishment').directive('scrollSize', function () {
	'use strict';

	return {
		restrict: 'AE',
		
		link: function (scope, element, attrs) {

            var length = parseInt(attrs.length),
                itemWidth = parseInt(attrs.itemWidth),
                marginSize = parseInt(attrs.marginSize);
            
            element[0].style.width = (length * itemWidth) + ((length - 1) * marginSize) + 'px';
		}
	};
});