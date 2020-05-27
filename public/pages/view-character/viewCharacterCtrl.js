angular.module('app').controller('viewCharacterCtrl', ['$scope', '$routeParams', 'metaFactory', 'charactersFactory', 'storysFactory', 'eventsFactory',
    function viewCharacterCtrl($scope, $routeParams, metaFactory, charactersFactory, storysFactory, eventsFactory) {
    'use strict';

        var itemId = $routeParams.itemId;
        $scope.metaFactory = metaFactory.meta;
        $scope.viewItem = charactersFactory.data.chara;
        $scope.storysFactory = storysFactory.data;
        $scope.eventsFactory = eventsFactory.data;

        charactersFactory.getChara(itemId);

        $scope.deleteChara = function(itemId) {
            charactersFactory.deleteChara(itemId);
            metaFactory.getNames();
        };

}]);
