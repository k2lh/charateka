angular.module('app').controller('viewDataCtrl', ['$scope', 'charactersFactory', 'eventsFactory',
    function viewDataCtrl($scope, charactersFactory, eventsFactory) {
    'use strict';

        $scope.eventsFactory = eventsFactory.data;

        $scope.charactersFactory = charactersFactory.data;
        charactersFactory.getAllCharacters();


}]);
