angular.module('app').controller('viewListCtrl', ['$scope', 'charactersFactory', 'storysFactory', '$http', 'API', 'metaFactory', '$window',
    function viewListCtrl($scope, charactersFactory, storysFactory, $http, API, metaFactory, $window) {
    'use strict';

        var calls = API;
        var userId = $window.sessionStorage.userId;
        $scope.selectFilter = {};
        $scope.storysFactory = storysFactory.data;
        $scope.metaFactory = metaFactory.meta;

        $scope.setEditedChara = function(itemId) {
            charactersFactory.getChara(itemId);
        };

        $scope.addNewCharLine = false;
        $scope.addNewChara = function() {
            $scope.addNewCharLine = true;
        };

        $scope.addNewChar = function(item) {
            var bulk = [];
            item.user_id = userId;
            item.attendsid = searchName(item.attends, $scope.metaFactory.names);
            bulk.push(item);
            charactersFactory.addCharacters(bulk).then(function(data) {
                charactersFactory.getCharacterList();
                metaFactory.getNames();
                $scope.character= {};
                $scope.addNewCharLine = false;
            });
        }

        $scope.cancelChar = function(item)  {
            $scope.addNewCharLine = false;
        };

        function searchName(nameKey, myArray) {
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].name === nameKey) {
                    return myArray[i]._id;
                }
            }
        }

}]);