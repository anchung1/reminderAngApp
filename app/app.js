'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.view1',
  'myApp.util',
  'myApp.createUser',
  'myApp.login',
  'myApp.addEntry',
  'myApp.userData',
  'myApp.delData'
]).
    config(['$routeProvider', function ($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
