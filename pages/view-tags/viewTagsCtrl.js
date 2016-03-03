angular.module('app').controller('viewTagsCtrl', ['$scope', 'metaFactory', 'API', '$http',
    function viewTagsCtrl($scope, metaFactory, API, $http) {
    'use strict';

        $scope.total = {};
        var calls = API;
        $scope.metaFactory = metaFactory.meta;

        angular.forEach($scope.metaFactory.tags, function(val){
            $http({
                method: 'GET',
                url: calls.onetagdata + '/' + val,
                headers: {
                    'x-access-token':  calls.token
                }
            }).success(function (response) {
                $scope.total[val] = {
                    category: val,
                    data: response
                };
            });
        });


}]);
