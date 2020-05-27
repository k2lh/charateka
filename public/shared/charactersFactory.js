angular.module('app').factory('charactersFactory', ['$http', 'API', 'eventsFactory', 'metaFactory',
    function charactersFactory($http, API, eventsFactory, metaFactory) {
        'use strict';

        var calls = API;
        var service = {};
        var eventsFactory = eventsFactory.data;

        service.data = {};
        service.data.onlyone = '';
        service.data.characterlist = [];
        service.data.allcharacters = [];

        service.data.chara = {};
        service.data.chara.character = {};
        service.data.chara.history = [];
        service.data.chara.roles = {};

        service.addCharacters = function(item) {
            return $http({
                method: 'POST',
                url: calls.charadata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getCharacterList();
            });
        };

        service.addOneChara = function(item) {
            return $http({
                method: 'POST',
                url: calls.charadata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.data.onlyone = response._id;
            });
        };

        service.getCharacterList = function() {
            return $http({
                method: 'GET',
                url: calls.charadata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.characterlist = response.data;
                metaFactory.getNames();
            });
        };

        service.getAllCharacters = function() {
            return $http({
                method: 'GET',
                url: calls.charadata + '/all',
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.allcharacters = response.data;
            });
        };

        service.getChara = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.charadata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                service.data.chara.character = data.character[0];
                service.data.chara.history = data.history;
                if (data.character[0].ochardb.length < 1) {
                    service.data.chara.character.ochardb.push({'name': ''});
                }
                service.getCharaLinks(itemId);
            });
        };

        service.getCharaLinks = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.charalinkdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                service.data.chara.charlinks = data;
            });
        };

        service.updateChara = function(item) {
            return $http({
                method: 'PUT',
                url: calls.charadata + '/' + item._id,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getCharacterList();
            });
        }

        service.deleteChara = function(itemId) {
            // service.deleteRole(itemId);
            return $http({
                method: 'DELETE',
                url: calls.charadata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token
                }
            })
            .then(function (response) {
                service.getCharacterList();
            });
        }

        service.getCharacterList();

        return service;
    }
]);
