angular.module('app').controller('viewEventsCtrl', ['$scope', '$http', 'API', 'eventsFactory', 'metaFactory', 'storysFactory', '$window',
    function viewEventsCtrl($scope, $http, API, eventsFactory, metaFactory, storysFactory, $window) {
    'use strict';

        var userId = $window.sessionStorage.userId;
        var calls = API;

        $scope.selectFilter = {};
        $scope.selectFilter.arc = '';
        $scope.selectFilter.label = '';

        $scope.metaFactory = metaFactory.meta;
        $scope.storysFactory = storysFactory.data;
        $scope.eventsFactory = eventsFactory.data;
        if ($scope.eventsFactory.events === undefined) {
            $scope.totalevent = 0;
            console.log('no events');
        } else {
            $scope.totalevent = Object.keys($scope.eventsFactory.events).length;
            // $scope.totalevent = $scope.eventsFactory.events.length;
            console.log('have events', $scope.totalevent);
        }

        $scope.checkOrder = function(event, ind) {
            $scope.checked = {};
            if (event.follows === undefined) {
                changeOrderCall(event, ind);
            } else {
                $scope.orderBefore = getOrderFollows($scope.eventsFactory.events, '_id', event.follows._id);
                if ($scope.orderBefore < event.order) {
                    changeOrderCall(event, ind);
                } else {
                    $scope.checked[ind] = true;
                    $scope.followsTitle = event.follows.title;
                }
            }
        };

        $scope.changeOrder = function(event, ind) {
            changeOrderCall(event, ind);
        };

        $scope.resetOrder = function(ind) {
            $scope.checked[ind] = false;
            eventsFactory.getEventsList();
        };

        function getOrderFollows(arraytosearch, key, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i][key] == valuetosearch) {
                    return arraytosearch[i].order;
                }
            }
        }

        function changeOrderCall(event, ind) {
            $scope.checked[ind] = false;
            $http({
                method: 'PUT',
                url: calls.eventsdata + '/' + event._id,
                data: event,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                eventsFactory.getEventsList();
            });
        }

        $scope.makeNew = function() {
            var order = $scope.totalevent + 1;
            var item = {
                order: order,
                user_id: userId,
                change: [{"name": ""}],
                speak: [],
                nospeak: [],
                reffed: []
            };
            eventsFactory.addEvent(item);
        };

        $scope.reorder = function() {
            for (var i = 0; i < $scope.eventsFactory.events.length; i++) {
                console.log($scope.eventsFactory.events.length);
                $scope.eventsFactory.events[i].order = (i +1);
                $scope.checked = [];
                changeOrderCall($scope.eventsFactory.events[i], i);
            }
        };

}]);

