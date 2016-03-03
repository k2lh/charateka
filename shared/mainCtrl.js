angular.module('app').controller('mainCtrl', ['$scope', '$localStorage', '$http', '$window', 'metaFactory', 'charactersFactory', 'eventsFactory', 'storysFactory', 'varsFactory',
    function mainCtrl($scope, $localStorage, $http, $window, metaFactory, charactersFactory, eventsFactory, storysFactory, varsFactory) {
        'use strict';

        $scope.isCollapsed = true;
        $scope.displayed = false;
        $scope.toggleMenu = function() {
            $scope.displayed = !$scope.displayed;
        };
        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
        $scope.radioModel = 'Left';

        $scope.gender = varsFactory.gender;
        $scope.role = varsFactory.role;
        $scope.participation = varsFactory.participation;
        $scope.skin = varsFactory.skin;
        $scope.listValues = varsFactory.listValues;

        $scope.charactersFactory = charactersFactory.data;
        $scope.storysFactory = storysFactory.data;
        $scope.storys = $localStorage.storys;
        $scope.metaFactory = metaFactory.meta;
        $scope.eventsFactory = eventsFactory.data;

        // $scope.leave = function() {
        //     authService.ClearCredentials();
        // };

        $scope.$on('$viewContentLoaded', function () {
            $window.scrollTo(0, 0);
        });

        $http.get('https://api.github.com/repos/k2lh/charateka/issues?state=open').then(function (response) {
            $scope.issues = response.data;
        });

    }
]);

