/*global angular*/
angular.module('replenishment').service('authenticationManager', ['localStorageProxy', 'userData', function (localStorageProxy, users) {
    'use strict';

    var self = this;

    self.signin = function (login, password) {
        var i, found = false, user;

        for (i = 0; i < users.length; i += 1) {
            user = users[i];

            if (user.login === login) {
                found = true;
                localStorageProxy.add('USER_LOGIN', user.login);
                localStorageProxy.add('USER_ROLE', user.role);

                break;
            }
        }

        return found;
    };

    self.signout = function () {
        localStorageProxy.remove('USER_LOGIN');
        localStorageProxy.remove('USER_ROLE');
    };

}]);