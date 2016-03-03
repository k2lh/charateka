angular.module('appLogin').factory('authService', ['$http', '$rootScope' , '$location', '$localStorage', '$window', '$httpParamSerializerJQLike',
    function ($http, $rootScope, $location, $localStorage, $window, $httpParamSerializerJQLike) {
        'use strict';

        var service = {};
        service.error = [];

        service.login = function (username, password) {
            return $http({
               method: 'POST',
               url: '/api/authenticate',
               data: $httpParamSerializerJQLike({
                    "username": username,
                    "password": password
               }),
               headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
               }
            }).then(function (response) {
                if(response.data.token) {
                    var userId = response.data.userId;
                    var token = response.data.token;
                    $window.sessionStorage.token = token;
                    $window.sessionStorage.userId = userId;
                    $http({
                        method: 'GET',
                        url: '/api/values/' + userId,
                        headers: {
                            'x-access-token':  token
                        }
                    }).then(function (response) {
                        $localStorage.values = response.data[0];
                        $window.location.href = '/home.html';
                    }).catch(function(response) {
                        service.error = response;
                    });
                } else {
                    service.error = response;
                }
            }).catch(function(response) {
                service.error = response;
            });
        };

        service.register = function(username, password, email) {
            return $http({
               method: 'POST',
               url: '/api/register',
               data: $httpParamSerializerJQLike({
                    "username": username,
                    "password": password,
                    "email": email
               }),
               headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
               }
            }).success(function (response) {
                if(response == 'success') {
                    $location.path('/login/registered');
                } else {
                    $scope.error = "Something went wrong!" + response;
                }
            });
        };

        service.ClearCredentials = function () {
            $window.sessionStorage.clear();
           $window.location.href = '/index.html';
        };

        return service;
}]);