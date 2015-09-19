'use strict';

angular.module('myApp.login', [])

    .directive('myLogin', ['httpService', function(httpService) {

        var template = '<input ng-model="username" type="text" placeholder="Username" autofocus>' +
            '<input ng-model="password" type="password" placeholder="Password" ng-keypress="keyPress($event)">';

        var ENTER_KEY = 13;
        var logFunc = undefined;

        function log(msg) {
            logFunc({data:msg});
        }


        var controller = function($scope) {
            logFunc = $scope.statusCall;
        };

        var link = function($scope, elem, attr) {

            $scope.keyPress = function($event) {
                if ($event.which == ENTER_KEY) {
                    console.log($scope.username);
                    console.log($scope.password);

                    httpService.login($scope.username, $scope.password).then(
                        function() {
                            log('Log in successful.');
                            $scope.configData({data: $scope.username});
                        },
                        function() {
                            log('Bad credential.  Check username and password.');
                        }
                    );
                }
            };


        };

        return {
            template: template,
            restrict: 'E',
            scope: {
                statusCall: "&statusCall",
                configData: "&configData"
            },
            controller: controller,
            link: link
        }
    }])
;