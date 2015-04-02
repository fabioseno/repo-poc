/*global angular*/
angular.module('replenishment').directive('numericSelector', function () {
	'use strict';

	return {
		restrict: 'AE',
		
		templateUrl: 'js/visual/numeric-selector-template.html',
		
		scope: {
			quantity: '='
		},
		
		link: function (scope, element, attrs) {

			if (!scope.quantity) {
				scope.quantity = 0;
			} else {
				scope.quantity = parseInt(scope.quantity);
			}
			
			scope.decrease = function () {
				if (scope.quantity > 0) {
					scope.quantity -= 1;
				}
			};
			
			scope.increase = function () {
				scope.quantity += 1;
			};
			
		}
	};
});