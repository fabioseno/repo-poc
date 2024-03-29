/*global angular*/
(function () {
    'use strict';

    function Settings($scope, $timeout, $location, authenticationManager, requestManager, settingsManager, userManager) {
        var vm = this;

        vm.getUserName = function () {
            return userManager.getUserName();
        };

        vm.settings = {
            useEcommerceNames: settingsManager.getValue(settingsManager.settings.useEcommerceNames),
            showPictures: settingsManager.getValue(settingsManager.settings.showPictures),
            onlinePictures: settingsManager.getValue(settingsManager.settings.onlinePictures)
        };

        vm.resetRequests = function () {
            navigator.notification.confirm('Deseja limpar as solicitações?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    $timeout(function () {
                        requestManager.resetRequests();
                    });
                }
            }, 'Limpar');
        };

        vm.signout = function () {
            navigator.notification.confirm('Deseja realmente sair?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    $timeout(function () {
                        $location.path('/login');
                        authenticationManager.signout();
                    });
                }
            }, 'Sair');
        };

        $scope.$watch('vm.settings.useEcommerceNames', function (value) {
            settingsManager.setValue(settingsManager.settings.useEcommerceNames, value);
        });

        $scope.$watch('vm.settings.showPictures', function (value) {
            settingsManager.setValue(settingsManager.settings.showPictures, value);
        });

        $scope.$watch('vm.settings.onlinePictures', function (value) {
            settingsManager.setValue(settingsManager.settings.onlinePictures, value);
        });
    }

    Settings.$inject = ['$scope', '$timeout', '$location', 'authenticationManager', 'requestManager', 'settingsManager', 'userManager'];

    angular.module('replenishment').controller('settings', Settings);

}());