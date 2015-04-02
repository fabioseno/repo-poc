/*global angular*/
angular.module('replenishment').filter('todayDateFormat', ['$filter', function ($filter) {
	'use strict';

	return function (date, todayFormat, normalFormat) {
        var parsedDate = new Date(date);
        
        if ($filter('date')(parsedDate, 'ddMMyyyy') === $filter('date')(new Date(), 'ddMMyyyy')) {
            return $filter('date')(parsedDate, todayFormat);
        } else {
            return $filter('date')(parsedDate, normalFormat);
        }
    };

}]);
