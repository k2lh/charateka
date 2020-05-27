angular.module('app').factory('eventsFactory', ['$http', 'API', '$location',
    function eventsFactory($http, API, $location) {
        'use strict';

        var calls = API;
        var service = {};
        service.data = {};
        service.data.events = {};
        service.data.eventone = {};

        // multiple events actions

        service.getAllEvents = function() {
            return $http({
                method: 'GET',
                url: calls.eventsdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.events = response.data;
            });
        };

        service.getEventsList = function() {
            return $http({
                method: 'GET',
                url: calls.eventlistdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.list = response.data;
            });
        };

        service.bulkEvents = function(item) {
            return $http({
                method: 'POST',
                url: calls.eventsdata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.removeChange = function(item, eventId) {
            return $http({
                method: 'PUT',
                url: calls.changedata + '/' + eventId,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        }

        // single event actions

        service.getEvent = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.eventsdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.eventone = response.data[0];
                service.data.eventone.change.push({'name': ''});
            });
        };


        service.addEvent = function(item) {
            return $http({
                method: 'POST',
                url: calls.eventsdata + '/new',
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.data.eventone = response.data;
                $location.path('/edit-event/' + response.data._id);
            });
        };

        service.updateEvent = function(item) {
            return $http({
                method: 'PUT',
                url: calls.eventsdata + '/' + item._id,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.removeEvent = function(itemId) {
            return $http({
                method: 'DELETE',
                url: calls.eventsdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.getEventsList();
        service.getAllEvents();

        return service;

    }
]);