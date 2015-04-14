/*global angular*/
angular.module('replenishment').filter('listFilter', ['requestManager', function (requestManager) {
    'use strict';

    return function (requests, config) {
        var idStatement = false,
            createdByStatement = false,
            divisionStatement = false,
            groupStatement = false,
            statusStatement = false,
            result = [];

        if (requests && config) {
            angular.forEach(requests, function (request) {
                idStatement = false;
                createdByStatement = false;
                divisionStatement = false;
                groupStatement = false;
                statusStatement = false;
                    
                if (!config.id || String(request.id) === config.id) {
                    idStatement = true;
                }

                if (!config.createdBy || request.createdBy.toUpperCase().indexOf(config.createdBy.toUpperCase()) >= 0) {
                    createdByStatement = true;
                }

                if (!config.division || request.division.toUpperCase().indexOf(config.division.toUpperCase()) >= 0) {
                    divisionStatement = true;
                }

                if (!config.group || request.group.toUpperCase().indexOf(config.group.toUpperCase()) >= 0) {
                    groupStatement = true;
                }

                if ((config.status)
                        && ((config.status.draft && request.status.id === requestManager.status.draft.id)
                        || (config.status.pending && request.status.id === requestManager.status.pending.id)
                        || (config.status.inSeparation && request.status.id === requestManager.status.inSeparation.id)
                        || (config.status.separated && request.status.id === requestManager.status.separated.id)
                        || (config.status.finished && request.status.id === requestManager.status.finished.id))) {
                    statusStatement = true;
                }
                
                if (idStatement && createdByStatement && divisionStatement && groupStatement && statusStatement) {
                    result.push(request);
                }
            });
        }

        return result;
    };
}]);