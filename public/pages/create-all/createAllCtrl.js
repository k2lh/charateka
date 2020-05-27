angular.module('app').controller('createAllCtrl', ['$scope', '$http',  'API', '$window', 'storysFactory', 'eventsFactory', 'charactersFactory', 'metaFactory', 'statsFactory',
    function createAllCtrl($scope, $http, API, $window, storysFactory, eventsFactory, charactersFactory, metaFactory, statsFactory) {
    'use strict';

        var userId = $window.sessionStorage.userId;
        var calls = API;
        $scope.storydata =  storysFactory.data;
        $scope.events =  eventsFactory.events;

        $scope.newStory = [];
        $scope.newStory.order = $scope.storydata.storys.length + 1;

        $scope.addStory = function(item) {
            var data = {
                order: item.order,
                title: item.title
            };
            storysFactory.addStory(data);
        };

        $scope.updateStory = function(item) {
            storysFactory.updateStory(item);
        };

        $scope.removeStory = function(item) {
            storysFactory.removeStory(item);
        };

        $scope.newstuff = [];
        $scope.importEvents = function(val) {
            $scope.eventmessage = [];
            if ($scope.events === undefined) {
                var order = 1;
            } else {
                var order = $scope.events.length;
            }
            var arr = [];
            for(var i = 0; i < val.list.length; i++) {
                arr = val.list[i].split("|");
                if (arr.length < 5) {
                    $scope.eventmessage.text = 'It looks like you only have ' + arr.length + ' items in a row. If you want to skip a field, remember to use two pipes || to mark an empty field, including the final field.';
                    $scope.eventmessage.type = 'danger';
                } else {
                    $scope.eventmessage = [];
                    order = order + 1;
                    var arr2 = {
                        order: order,
                        title: arr[0],
                        start: arr[1],
                        end: arr[2],
                        arc: arr[3],
                        label: arr[4],
                        user_id: userId,
                        story: val.story._id
                    };
                    $http({
                        method: 'POST',
                        url: calls.eventsdata,
                        data: arr2,
                        headers: {
                            'x-access-token':  calls.token,
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        $scope.events = response.data;
                    });
                    $scope.eventmessage.text = val.list.length + ' events imported successfully!';
                    $scope.eventmessage.type = 'success';
                    $scope.newstuff = [];
                    }
            }
        };

        $scope.importCharas = function(list) {
            $scope.charamessage = [];
            var bulk = [];
            var arr = [];
            for(var i = 0; i < list.length; i++) {
                arr = list[i].split("|");
                if (arr.length < 3) {
                    $scope.charamessage.text = 'It looks like you only have ' + arr.length + ' items in a row. Remember to use two pipes || to mark an empty value.';
                    $scope.charamessage.type = 'danger';
                    break;
                } else {
                    $scope.eventmessage = [];
                    var base = {
                        name: arr[0],
                        age: arr[1],
                        gender: arr[2],
                        user_id: userId,
                        ochardb: [],
                        tags: [],
                        attendee: [],
                        storyset: []
                    };
                    bulk.push(base);
                }
            }
            if (bulk.length > 0) {
                // $http({
                //     method: 'POST',
                //     url: calls.charadata,
                //     data: bulk,
                //     headers: {
                //         'x-access-token':  calls.token,
                //         'Content-Type': 'application/json'
                //     }
                // }).then(function () {
                //     $scope.charamessage.text = list.length + ' characters imported successfully!';
                //     $scope.charamessage.type = 'success';
                //     $scope.list = [];
                //     metaFactory.getNames();
                // });
                charactersFactory.addCharacters(bulk);
            }
        };


}]);