/*global angular*/
angular.module('replenishment').directive('scrollSize', function () {
	'use strict';

	return {
		restrict: 'AE',
		
		link: function (scope, element, attrs) {

            var itemLength = parseInt(attrs.itemLength),
                itemWidth = parseInt(attrs.itemWidth),
                marginSize = parseInt(attrs.marginSize),
                scrollSize = (itemLength * itemWidth) + (itemLength * marginSize),
                computedWidth;
            
            computedWidth = parseInt(window.getComputedStyle(element[0].parentElement, null).getPropertyValue("width").replace('px', ''));
            
            if (scrollSize > computedWidth) {
                element[0].style.width = scrollSize + 'px';
            } else {
                element[0].style.width = '100%';
            }
		}
	};
});