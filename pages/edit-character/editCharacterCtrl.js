angular.module('app').controller('editCharacterCtrl', ['$scope', '$routeParams', 'metaFactory', 'charactersFactory', 'storysFactory', '$window', 'statsFactory',
    function editCharacterCtrl($scope, $routeParams, metaFactory, charactersFactory, storysFactory, $window, statsFactory) {
    'use strict';

        var itemId = $routeParams.itemId;
        var userId = $window.sessionStorage.userId;

        $scope.metaFactory = metaFactory.meta;
        $scope.editchara = charactersFactory.data.chara;
        $scope.storysFactory = storysFactory.data;

        charactersFactory.getChara(itemId);

        $scope.addStorySet = function(ind) {
            $scope.editchara.character.roles[ind].story_id = $scope.storysFactory.storys[ind]._id;
        };

        if (!$scope.editchara.character.ochardb || $scope.editchara.character.ochardb.length < 1) {
            $scope.editchara.character.ochardb =  [{"name":''}];
        }

        $scope.addOchardb = function() {
            $scope.editchara.character.ochardb.push({"name":''});
        };

        $scope.pushTo = function(tag) {
            $scope.editchara.character.tags.push(tag);
            var index = $scope.metaFactory.tags.indexOf(tag);
            $scope.metaFactory.tags.splice(index, 1);
        };

        $scope.removeFrom = function(tag) {
            var index = $scope.editchara.character.tags.indexOf(tag);
            $scope.editchara.character.tags.splice(index, 1);
            // $scope.metaFactory.tags.push(tag);
        };

        $scope.addNew = function(tag) {
            if (tag !== '' && tag !== undefined && tag !== null) {
                if (($scope.metaFactory.tags.indexOf(tag) == -1) && ($scope.editchara.character.tags.indexOf(tag) == -1)) {
                    $scope.editchara.character.tags.push(tag);
                }
            }
            $scope.newtag = null;
        };

        $scope.updateChara = function(character) {
            character.attendsid = searchName(character.attends, $scope.metaFactory.names);
            if (character.ochardb !== ''){
                for (var i=0; i < character.ochardb.length; i++) {
                    character.ochardb[i].id = searchName(character.ochardb[i].name, $scope.metaFactory.names);
                }
            }
            if (character.roles !== ''){
                for (var i=0; i < character.roles.length; i++) {
                    if (character.roles[i].appears == false) {
                        character.roles.splice(i, 1);
                    }
                }
            }
            charactersFactory.updateChara(character).then(function(data) {
                metaFactory.getTags();
                metaFactory.getNames();
                metaFactory.getRanks();
                charactersFactory.getCharacterList();
                statsFactory.getStats();
            });
        };

        function searchName(nameKey, myArray) {
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].name === nameKey) {
                    return myArray[i]._id;
                }
            }
        }

}]);