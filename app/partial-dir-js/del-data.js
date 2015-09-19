'use strict';

angular.module('myApp.delData', [])

    .directive('myDelData', ['httpService', function(httpService) {

        var template = '';

        var ENTER_KEY = 13;
        var logFunc = undefined;

        function log(msg) {
            console.log(msg);
            logFunc({data:msg});
        }

        var controller = function($scope) {

        };

        var link = function($scope, elem, attr) {

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