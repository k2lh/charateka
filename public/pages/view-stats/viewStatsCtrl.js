angular.module('app').controller('viewStatsCtrl', ['$scope', 'statsFactory', 'charactersFactory', '$localStorage', '$filter',
    function viewStatsCtrl($scope, statsFactory, charactersFactory, $localStorage, $filter) {
    'use strict';

        var storys = $localStorage.storys;
        $scope.selectFilter = {
            story: {
                id: storys[0]._id,
                title: storys[0].title,
                order: storys[0].order
            }
        };
        statsFactory.getAllStats(storys[0]._id);

        $scope.statsFactory = statsFactory.data;
        $scope.storys = $localStorage.storys;
        $scope.charactersFactory = charactersFactory.data;

        statsFactory.getStats();
        // statsFactory.getAllStats();
        $scope.getStoryStats = function(id) {
            console.log(id);
            statsFactory.getAllStats(id);
        }

}]);