'use strict';

angular.module('myApp.addEntry', [])

    .directive('myAddEntry', ['httpService', '$interval', function(httpService, $interval) {


        var template =
                '<div class="row">' +
                    '<input class="col-md-offset-1 col-md-4" ng-model="title" placeholder="Entry Name" ng-keypress="keyPress($event)" ng-blur="inputBlur()" autofocus>' +
                    '<br/><br/>' +
                    '<textarea class="col-md-offset-1 col-md-10" ng-model="entryData"' +
                            'id="id-add-text" ' +
                            'disabled="disabled" rows="7" placeholder="Enter Data Here">' +
                    '</textarea>' +

                '</div>' +
                '<br/>' +
                '<div class="row">' +
                    '<button class="col-md-offset-1 btn btn-primary btn-sm" ng-click="postData()">Save</button>' +
                '</div>'

            ;

        var ENTER_KEY = 13;
        var TAB_KEY = 9;
        var logFunc = undefined;

        function log(msg) {
            console.log(msg);
            logFunc({data:msg});
        }

        function getEntry(title, cb) {
            var entryData;

            if (!title) return;

            httpService.getEntry(title).then(
                function(data) {
                    log(data.data.data);
                    entryData = data.data.data;
                },
                function() {
                    entryData = undefined;
                }
            ).finally(
                function() {
                    $('#id-add-text')[0].disabled = false;
                    _.defer(function() {
                        $('#id-add-text').focus();
                    });

                    if (cb) cb(entryData);
                }
            );
        }


        var controller = function($scope) {
            on_start();

            function on_start() {
                logFunc = $scope.statusCall;

                getEntry($scope.title, $scope.setEntryData);
                $scope.keepAlive({set:true});
            }


            $scope.postData = function() {
                httpService.postEntry({title: $scope.title, data: $scope.entryData}).then(
                    function(data) {
                        log($scope.title + " entry " + data.data);
                    },
                    function(data) {
                        log($scope.title + " failed to add. " + data.status + " " + data.statusText);
                    }
                ).finally(
                    function() {
                        $scope.keepAlive({set:true});
                    }
                );
            };

            $scope.setEntryData = function(data) {
                $scope.entryData = data;
            };
        };

        var link = function($scope, elem, attr) {


            $scope.inputBlur = function() {
                getEntry($scope.title, $scope.setEntryData);
                $scope.keepAlive({set:true});

            };

            $scope.keyPress = function($event) {
                $scope.keepAlive({set:true});
                if ($event.which == ENTER_KEY || $event.which == TAB_KEY) {

                    getEntry($scope.title, $scope.setEntryData);
                }
            };


        };

        return {
            template: template,
            restrict: 'E',
            scope: {
                statusCall: "&statusCall",
                title: "@title",
                keepAlive: "&keepAlive"
            },
            controller: controller,
            link: link
        }
    }])
;