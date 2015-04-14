/*global angular*/
angular.module('replenishment').service('authenticationManager', ['sessionStorageProxy', 'userData', function (sessionStorageProxy, users) {
    'use strict';

    var self = this;

    self.signin = function (login, password) {
        var i, user;

        for (i = 0; i < users.length; i += 1) {
            user = users[i];

            if (user.login === login) {
                sessionStorageProxy.add('USER_LOGIN', user.login);
                sessionStorageProxy.add('USER_ROLE', user.role);
                sessionStorageProxy.add('USER_NAME', user.name);
                sessionStorageProxy.remove('FILTER');

                return user;
            }
        }

        return;
    };

    self.signout = function () {
        sessionStorageProxy.remove('USER_LOGIN');
        sessionStorageProxy.remove('USER_ROLE');
        sessionStorageProxy.remove('USER_NAME');
        sessionStorageProxy.remove('FILTER');
    };

}]);