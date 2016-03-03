angular.module('app').controller('viewSummaryCtrl', ['$scope', 'eventsFactory', 'storysFactory',
    function viewSummaryCtrl($scope, eventsFactory, storysFactory) {
    'use strict';

        $scope.data = eventsFactory.data;
        $scope.storysFactory = storysFactory.data;
        $scope.summarytext = false;

}]);