'use strict';

angular.module('myApp.util', [])

    .directive('autofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $timeout(function() {
                    console.log('in autofocus');
                    $element[0].focus();
                    $element[0].select();
                });
            }
        }
    }])
;