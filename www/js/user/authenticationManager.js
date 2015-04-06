/*global angular*/
angular.module('replenishment').service('authenticationManager', ['localStorageProxy', 'userData', function (localStorageProxy, users) {
    'use strict';

    var self = this;

    self.signin = function (login, password) {
        var i, user;

        for (i = 0; i < users.length; i += 1) {
            user = users[i];

            if (user.login === login) {
                localStorageProxy.add('USER_LOGIN', user.login);
                localStorageProxy.add('USER_ROLE', user.role);
                localStorageProxy.add('USER_NAME', user.name);

                return user;
            }
        }

        return;
    };

    self.signout = function () {
        localStorageProxy.remove('USER_LOGIN');
        localStorageProxy.remove('USER_ROLE');
        localStorageProxy.remove('USER_NAME');
    };

}]);