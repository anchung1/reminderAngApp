'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'httpService', '$interval', function ($scope, httpService, $interval) {

        var timer = undefined;
        var defaultMsg = 'Welcome';
        var ENTER_KEY = 13;
        var timer, resetTimerVal, timerFunc;


        on_start();

        function on_start() {
            $scope.showData = defaultMsg;
            $scope.validate = false;
            $scope.mode = undefined;

            timerFunc = logout;
        }

        function log(data) {
            console.log(data);
            displayData(data);
        }

        function resetTimer(set) {
            console.log('reset timer');
            $interval.cancel(resetTimerVal);
            if (set)
                resetTimerVal = $interval(function() {
                    log('Session timed out.');
                    timerFunc();
                }, 300000, 1);
        }

        function displayData(data) {
            $scope.showData = data;
            $interval.cancel(timer);

            timer = $interval(function() {
                $scope.showData = defaultMsg;
            }, 20000, 1);
        }

        function getNextMode() {
            if ($scope.submode == 'get') {
                return 'add';
            }

            return 'get';
        }

        function logout() {
            console.log('logout called');
            $scope.mode = undefined;
            $scope.submode = undefined;
            $scope.username = undefined;
            $scope.password = undefined;
            $scope.nextButtonTitle = undefined;
        }

        $scope.statusCall = function(data) {
            displayData(data);
        };

        $scope.resetTimer = function(set) {
            resetTimer(set);
        };

        $scope.createAccount = function() {
            if ($scope.mode == 'create') {
                $scope.mode = undefined;
                return;
            }
            $scope.mode = 'create';
        };

        $scope.newUser = function(data) {
            $scope.mode = 'createD';
        };

        $scope.login = function(data) {
            $scope.mode = 'validated';
            $scope.submode = 'get';
            $scope.username = data;
            $scope.nextButtonTitle = 'Add Entry';

        };


        $scope.logout = function() {
            logout();

        };


        $scope.configMode = function(data) {

            if (data.mode == 'edit') {
                $scope.submode = 'edit';
                $scope.title = data.title;
                $scope.nextButtonTitle = 'Show Entry';
            }

            if (data.click == true) {
                $scope.submode = getNextMode();
                $scope.title = undefined;


                if ($scope.submode == 'get') {
                    $scope.nextButtonTitle = 'Add Entry';
                } else {
                    $scope.nextButtonTitle = "Show Entries";
                }

                resetTimer(true);
            }

        };


        function test() {
            httpService.getGreetings();
        }

        $scope.postData = function() {

            console.log($scope.title);
            console.log($scope.entryData);

            httpService.postEntry({name: $scope.title, occupation: $scope.entryData}).then(
                function(data) {
                    displayData(data.data);

                },
                function() {
                    displayData('post failure');
                    //console.log('cause birds hate that');
                }
            )
        };



    }])




;