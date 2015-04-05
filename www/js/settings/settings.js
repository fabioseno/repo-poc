/*global angular*/
(function () {
    'use strict';

    function Settings($scope, $location, authenticationManager, settingsManager) {
        var vm = this;

        vm.settings = {
            useEcommerceName: settingsManager.getValue(settingsManager.settings.useEcommerceName) == 'false' ? false : true,
            showPictures: settingsManager.getValue(settingsManager.settings.showPictures) == 'false' ? false : true,
            onlinePictures: settingsManager.getValue(settingsManager.settings.onlinePictures) == 'false' ? false : true
        };

        vm.signout = function () {
            navigator.notification.confirm('Deseja realmente sair?', function (buttonIndex) {
                if (buttonIndex === 1) {
                    authenticationManager.signout();
                    $location.path('/');
                }
            }, 'Sair');
        };

        $scope.$watch('vm.settings.useEcommerceName', function (value) {
            settingsManager.setValue(settingsManager.settings.useEcommerceName, value);
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