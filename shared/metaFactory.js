angular.module('app').factory('metaFactory', ['$http', 'API',
    function metaFactory($http, API) {
        'use strict';

        var calls = API;
        var service = {};
        service.meta = {};
        service.meta.values = {};
        service.meta.names = [];
        service.meta.ranks = [];
        service.meta.tags = [];

        service.getValues = function() {
            return $http({
            method: 'GET',
            url: calls.valuesdata,
            headers: {
                'x-access-token':  calls.token
            }
            }).then(function (response) {
                service.meta.values =  response.data[0];
            });
        };

        service.getNames = function() {
            return $http({
                method: 'GET',
                url: calls.namesdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                // var data = response.data;
                // var allNames = [];
                // for (var i = 0; i < data.length; i++) {
                //    if (data[i].aka !== undefined && data[i].aka.length > 0) {
                //        allNames.push({
                //             name: data[i].aka,
                //             _id: data[i]._id
                //        });
                //    } else {
                //         allNames.push({
                //             name: data[i].name,
                //             _id: data[i]._id
                //         });
                //    }
                // }
                service.meta.names = response.data;
            });
        };

        service.getRanks = function() {
            var arr = [];
            var arr2 = [];
            return $http({
                method: 'GET',
                url: calls.ranksdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                var data = response.data;
                for(var i = 0; i < data.length; i++) {
                    var rank = data[i].rank.toLowerCase();
                    if ( rank !== undefined) {
                        if (rank.indexOf(", ") > -1) {
                            var split = rank.split(", ");
                            for (var j = 0; j < split.length; j++) {
                                split[j] = split[j].replace(/^\s+|\s+$/g,'');
                            }
                            arr2 = arr2.concat(split);
                        } else {
                            arr2.push(rank);
                        }
                    }
                }
                for(i = 0; i < arr2.length; i++) {
                    if(arr.indexOf(arr2[i]) == -1) {
                        arr2[i].replace(/^\s+|\s+$/g,'');
                       arr.push(arr2[i]);
                    }
                }
                arr.sort();
                service.meta.ranks = arr;
            });
        };

        service.getTags = function() {
            var arr = [];
            return $http({
                method: 'GET',
                url: calls.tagdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                var data = response.data;
                for(var i = 0; i < data.length; i++) {
                    var group = data[i].tags;
                    if (group !== undefined){
                        for(var x = 0; x < group.length; x++) {
                            if(arr.indexOf(group[x]) == -1) {
                                var item = group[x].toLowerCase();
                               arr.push(item);
                            }
                        }
                    }
                }
                var taglist = arr;
                taglist.sort();
                service.meta.tags = taglist;
            });
        };

        service.updateValues = function(item) {
            return $http({
                method: 'PUT',
                url: calls.valuesdata,
                data: item,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.getValues();
            });
        }

        service.getValues();
        service.getNames();
        service.getRanks();
        service.getTags();

        return service;

    }
]);