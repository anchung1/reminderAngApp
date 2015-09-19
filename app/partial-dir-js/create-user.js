'use strict';

angular.module('myApp.createUser', [])

    .directive('myCreateUser', ['httpService', function(httpService) {
        var ENTER_KEY = 13;
        var logFunc = undefined;

        function log(msg) {
            logFunc({data:msg});
        }

        var controller = function($scope) {
            $scope.user = {};
            $scope.pw = {};
            $scope.email = {};

            on_start();

            function on_start() {
                var message = 'in create user';
                logFunc = $scope.statusCall;
                
                log(message);
            }
        };

        var link = function($scope, elem, attr) {
            function checkUser(nextFunc) {

                //will get error if user is not found
                httpService.getUser($scope.user.value).then(
                    function() {
                        console.log('user ' + $scope.user.value + ' exists');
                        $scope.user.error = true;
                    },
                    function(data) {
                        log("" + data.status + " " + data.statusText);

                        console.log('user ' + $scope.user.value + ' does not exist');
                        $scope.user.error = false;

                        if(nextFunc) {
                            nextFunc();
                        }
                    }
                );

                return true;
            }

            function checkPW() {
                if (!$scope.pw.value1 && !$scope.pw.value2) {
                    $scope.pw.error = true;

                } else if ($scope.pw.value1 == $scope.pw.value2) {
                    $scope.pw.error = false;
                } else {
                    $scope.pw.error = true;
                }

                return ($scope.pw.error);
            }

            function checkEmail() {
                $scope.email.errMsg = "";

                if (!$scope.email.value1 && !$scope.email.value2) {
                    $scope.email.error = true;
                } else if ($scope.email.value1 == $scope.email.value2) {
                    var at = $scope.email.value1.split('@');
                    if (at.length == 2) {
                        $scope.email.error = false;
                    } else {
                        $scope.email.errMsg = "Invalid address format.";
                        $scope.email.error = true;
                    }
                } else {
                    $scope.email.errMsg = "Address mismatch.";
                    $scope.email.error = true;
                }

                return ($scope.email.error);
            }

            function submitFunc() {
                if ($scope.email.error || $scope.pw.error || $scope.user.error)  {
                    return;
                }

                httpService.createUser($scope.user.value, $scope.pw.value1, $scope.email.value1).then(
                    function(data) {
                        log("User " + $scope.user.value + " created.");
                        $scope.configData({data: "created"});
                    },
                    function(data) {
                        log("User create failed: " + data.status + " " + data.statusText);
                    }
                );

            }

            $scope.checkUser = checkUser;
            $scope.checkPW = checkPW;
            $scope.checkEmail = checkEmail;

            $scope.keyPress = function($event) {
                var hasErrors = false;
                if ($event.which == ENTER_KEY) {
                    //log('enter detected');
                    hasErrors |= checkUser(submitFunc);
                    hasErrors |= checkPW();
                    hasErrors |= checkEmail();
                }
            }
        };

        return {
            templateUrl: 'partial-dir-html/create-user.html',
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