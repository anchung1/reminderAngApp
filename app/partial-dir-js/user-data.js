'use strict';

angular.module('myApp.userData', [])

    .directive('myUserData', ['httpService', '$interval', function(httpService, $interval) {

        var template =

            '<div ng-show="hasData" class="well well-sm">{{entryData}}</div>' +
            '<ul id="entries" class="list-group">' +
                '<li ng-attr-id="li-{{$index}}" class="list-group-item" ng-repeat="elem in dataList"  style="background-color: {{backColor}}">' +
                    '<div class="row">' +

                        '<div class="col-md-7" ng-click="itemClick(elem, $index)">{{elem.title}}</div>' +
                        '<div class="col-md-offset-3 col-md-1">' +
                            '<i ng-click="edit(elem, $index)" class="fa fa-edit" style="color: #009900"></i>' +

                        '</div>' +
                        '<div class="col-md-1">' +
                            '<i ng-click="remove(elem, $index)" class="fa fa-remove" style="color: red"></i>' +

                        '</div>' +
                    '</div>' +
                '</li>' +
            '</ul>'
            ;

        var ENTER_KEY = 13;
        var logFunc = undefined;
        var LiBackgroundColor = '#fcfbed';
        var LiBackSelectColor = 'beige';
        var removeClickIndex;

        function log(msg) {
            console.log(msg);
            logFunc({data:msg});
        }

        function clickSelect(index) {
            $('.list-group-item').css('background-color', LiBackgroundColor);
            $('#li-'+index).css('background-color', LiBackSelectColor);
        }



        var controller = function($scope) {
            on_start();

            function on_start() {
                logFunc = $scope.statusCall;

                $scope.hasData = false;
                $scope.entryData = undefined;
                $scope.backColor = LiBackgroundColor;

                retrieveDB();
                $scope.keepAlive({set: true});
            }


            function retrieveDB() {
                httpService.getUserData().then(
                    function(data) {
                        $scope.dataList = data.data;
                        log("retrieved " + data.data.length + " items.");
                    },
                    function() {
                        $scope.dataList = [];
                        log("failed with " + data.status + " " + data.statusText);
                    }
                );
            }

            $scope.edit = function(dataElem, index) {
                log('edit ' + dataElem.title);
                clickSelect(index);

                $scope.keepAlive({set:true});
                $scope.configMode({data: {mode: 'edit', title: dataElem.title}})
            };

            $scope.remove = function(dataElem, index) {
                $('#li-'+index).css('background-color', 'orange');
                log("Press X again to delete permanently.");

                if (removeClickIndex == index) {
                    httpService.deleteEntry(dataElem.title).then(
                        function() {
                            log('item ' + dataElem.title + ' removed.');
                        },
                        function() {
                            log('Error: item ' + dataElem.title + ' not removed.');
                        }
                    ).finally(
                        function() {
                            $scope.hasData = false;
                            $scope.entryData = undefined;
                            retrieveDB();
                        }
                    );
                } else {
                    removeClickIndex = index;
                }

                $scope.keepAlive({set:true});
            };

        };

        var link = function($scope, elem, attr) {
            $scope.itemClick = function(elem, index) {
                $scope.hasData = true;
                $scope.entryData = elem.data;
                log(elem.title);

                window.scrollTo(0, 0);

                clickSelect(index);
                removeClickIndex = undefined;

                $scope.keepAlive({set:true});
            }
        };

        return {
            template: template,
            restrict: 'E',
            scope: {
                statusCall: "&statusCall",
                configMode: "&configMode",
                keepAlive: "&keepAlive"
            },
            controller: controller,
            link: link
        }
    }])

;