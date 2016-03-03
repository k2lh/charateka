angular.module('app').controller('editValuesCtrl', ['$scope', 'metaFactory',
    function editValuesCtrl($scope, metaFactory) {
    'use strict';

        $scope.metaFactory = metaFactory.meta;

        $scope.updateValues = function(item) {
            delete item._id;
            metaFactory.updateValues(item);
        };

}]);