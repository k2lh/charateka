angular.module('app').controller('editEventCtrl', ['$scope', '$http', 'API', 'eventsFactory',  '$window',  '$routeParams', 'storysFactory', 'metaFactory',  '$location', 'charactersFactory',
    function editEventCtrl($scope, $http, API, eventsFactory, $window,  $routeParams, storysFactory, metaFactory, $location, charactersFactory) {
    'use strict';

        var calls = API;
        var eventId = $routeParams.eventId;
        var userId = $window.sessionStorage.userId;
        eventsFactory.getEvent(eventId);

        $scope.changeValue = 0;
        $scope.metaFactory = metaFactory.meta;
        $scope.storysFactory = storysFactory.data;
        $scope.editevent = eventsFactory.data;
        // $scope.totalevent = $scope.events.length;

        $scope.updateEvent = function(item) {
            var change = [];
            for(var i = 0; i < item.change.length; i++) {
                if (item.change[i].name.name !== undefined) {
                    var achange = {
                        char_id: item.change[i].name._id,
                        name: item.change[i].name.name,
                        notes: item.change[i].notes
                    };
                    change.push(achange);
                } else if (item.change[i].name !== '') {
                    change.push(item.change[i]);
                }
            }
            if (change !== undefined) {
                item.change = change;
            }
            eventsFactory.updateEvent(item);
        };

        $scope.confirmEvent = function(item) {
            if (item.title === undefined || item.story === undefined ) {
                eventsFactory.removeEvent(item._id);
                $location.path('/view-events');
            }
        };

        $scope.removeEvent = function(item) {
            eventsFactory.removeEvent(item._id);
            $location.path('/view-events');
        };

        $scope.removeChange = function(item, ind) {
            $scope.editevent.eventone.change.splice(ind, 1);
        };

        $scope.addChanges = function() {
            $scope.editevent.eventone.change.push({'name': ''});
        };

        $scope.removeChar = function(arr, item) {
            move(arr, item);
        };

        $scope.addNewCharLine = false;
        $scope.addChar = function(arr, item, cat, box) {
            if (typeof item == 'string') {
                $scope.addNewCharLine = true;
                $scope.character = {
                    user_id: userId,
                    name: item,
                    box: box,
                    roles: [{
                        story_id: $scope.editevent.eventone.story._id,
                        appears: true,
                        role: cat
                    }]
                };
            } else {
                arr.push(item);
            }
        };

        $scope.addNewChar = function(item, set) {
            var bulk = [];
            var cat = item.box;
            bulk.push(item);
            charactersFactory.addCharacters(bulk);
            $scope.character= {};
            $scope.addNewCharLine = false;
            // get id, add to list of chars
            $http({
                method: 'GET',
                url: calls.chariddata + '/' + item.name,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                var speaknew = {
                    _id: response.data[0]._id,
                    name: item.name
                };
                set[cat].push(speaknew);
            });
        }

        $scope.cancelChar = function(item)  {
            $scope.addNewCharLine = false;
            $scope.character.name = '';
        };

        function move(arr, val) {
            var j = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === val.name) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }

}]);