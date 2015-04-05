/*global angular*/
(function () {
    'use strict';

    function Settings($scope, $location, authenticationManager, settingsManager) {
        var vm = this;

        vm.settings = {
            useEcommerceNames: settingsManager.getValue(settingsManager.settings.useEcommerceNames),
            showPictures: settingsManager.getValue(settingsManager.settings.showPictures),
            onlinePictures: settingsManager.getValue(settingsManager.settings.onlinePictures)
        };

        vm.signout = function () {
            navigator.notification.confirm('Deseja realmente sair?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    authenticationManager.signout();
                    $location.path('/');
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

    Settings.$inject = ['$scope', '$location', 'authenticationManager', 'settingsManager'];

    angular.module('replenishment').controller('settings', Settings);

}());