'use strict';

var httpServices = angular.module('myApp.services', []);

httpServices.factory('httpService', ['$http', function($http) {
    var factory = {};

    var apiUrl = 'https://localhost:3000/api/';
    var userUrl = 'https://localhost:3000/users/';

    factory.greet = function() {
        console.log('factory greeting');
    };

    factory.getGreetings = function() {
        var req = {
            method: 'GET',
            url: apiUrl + 'greet'
            //url: baseAddr + 'switches'
        };

        return $http(req);
    };

    factory.postEntry = function(data) {
        var req = {
            method: 'POST',
            url: apiUrl + 'db',
            data: data
        };

        return $http(req);
    };

    factory.getEntry = function(title) {
        var req = {
            method: 'GET',
            url: apiUrl + 'db/' + title
        };

        return $http(req);
    };

    factory.deleteEntry = function(data) {
        var req = {
            method: 'DELETE',
            url: apiUrl + 'db/' + data
        };

        return $http(req);
    };

    factory.login = function(name, pw) {
        var req = {
            method: 'POST',
            url: userUrl + 'login',
            data: {name: name, password: pw}
        };

        return $http(req);
    };

    factory.createUser = function(name, pw, email) {
        var req = {
            method: 'POST',
            url: userUrl + 'create',
            data: {name: name, password: pw, email: email}
        };

        return $http(req);
    };

    factory.getUser = function(name) {
        var req = {
            method: 'GET',
            url: userUrl + name
        };

        return $http(req);
    };

    factory.getUserData = function() {
        var req = {
            method: 'GET',
            url: apiUrl + 'db/' + 'userData'
        };

        return $http(req);
    };

    return factory;
}]);