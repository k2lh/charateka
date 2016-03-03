angular.module('app').factory('storysFactory', ['$http', 'API',  '$q', '$localStorage',
    function storysFactory($http, API,  $q, $localStorage) {
        'use strict';

        var calls = API;
        var service = {};
        service.data = {};
        service.data.storys = [];

        service.getStoryList = function() {
            return $http({
            method: 'GET',
            url: calls.storydata,
            headers: {
                'x-access-token':  calls.token
            }
            }).then(function (response) {
                service.data.storys = response.data;
                $localStorage.storys = response.data;
            });
        };

        service.addStory = function(item) {
            return $http({
                method: 'POST',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                //  return( request.then( handleSuccess, handleError ) );
                service.getStoryList();
            });
        };

        service.updateStory = function(item) {
            return $http({
                method: 'PUT',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getStoryList();
            });
        };

        service.removeStory = function(item) {
            return $http({
                method: 'DELETE',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getStoryList();
            });
        }

        function handleError( response ) {
            if ( ! angular.isObject( response.data ) || ! response.data.message ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            return( response.data );
        }

        service.getStoryList();

        return service;
    }
]);