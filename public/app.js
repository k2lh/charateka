angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ngStorage',
    'ngAnimate',
    // 'angular-loading-bar',
    'checklist-model',
    'nvd3',
    'ngTouch'
]);

angular.module('app').config(function($routeProvider) {
    'use strict';
    $routeProvider
        .when('/login', {
            templateUrl: 'index.html',
            controller: 'loginCtrl'
        })
        .when('/', {
            templateUrl: 'pages/view-list/viewList.html',
            controller: 'viewListCtrl',
            title: 'Overview'
        })
        .when('/view-stats', {
            templateUrl: 'pages/view-stats/viewStats.html',
            controller: 'viewStatsCtrl',
            title: 'Demographics'
        })
        .when('/create-all', {
            templateUrl: 'pages/create-all/createAll.html',
            controller: 'createAllCtrl',
            title: 'Set up characters, stories, events'
        })
        .when('/edit-character/:itemId/:itemName', {
            templateUrl: 'pages/edit-character/editCharacter.html',
            controller: 'editCharacterCtrl',
            // controllerAs: 'editchara',
            title: 'Edit Character'
        })
        .when('/view-character/:itemId/:itemName', {
            templateUrl: 'pages/view-character/viewCharacter.html',
            controller: 'viewCharacterCtrl',
            title: 'View Character'
        })
        .when('/edit-event/:eventId', {
            templateUrl: 'pages/edit-event/editEvent.html',
            controller: 'editEventCtrl',
            title: 'Edit/Add Events'
        })
        .when('/edit-event/new', {
            templateUrl: 'pages/edit-event/editEvent.html',
            controller: 'editEventCtrl',
            title: 'Edit/Add Events'
        })
        .when('/edit-values', {
            templateUrl: 'pages/edit-values/editValues.html',
            controller: 'editValuesCtrl',
            title: 'Edit Values'
        })
        .when('/view-events', {
            templateUrl: 'pages/view-events/viewEvents.html',
            controller: 'viewEventsCtrl',
            title: 'View Events Timeline'
        })
        .when('/view-tags', {
            templateUrl: 'pages/view-tags/viewTags.html',
            controller: 'viewTagsCtrl',
            title: 'All Tags'
        })
        .when('/view-list', {
            templateUrl: 'pages/view-list/viewList.html',
            controller: 'viewListCtrl',
            title: 'Character List'
        })
        .when('/view-info', {
            templateUrl: 'pages/view-info/viewInfo.html',
            controller: 'viewInfoCtrl',
            title: 'Information'
        })
        .when('/view-summary', {
            templateUrl: 'pages/view-summary/viewSummary.html',
            controller: 'viewSummaryCtrl',
            title: 'Summary from Timeline'
        })
        .when('/view-data', {
            templateUrl: 'pages/view-data/viewData.html',
            controller: 'viewDataCtrl',
            title: 'Export Data'
        })
        .otherwise({ redirectTo: '/' });

});

angular.module('app').run(['$window', '$rootScope',
    function ($window, $rootScope) {
        'use strict';
        $rootScope.$on('$locationChangeStart', function () {
            if (!$window.sessionStorage.token || $window.sessionStorage.token == 'undefined') {
                console.log('whoops not logged in?');
                $window.location.href = 'index.html';
            } else {
                // console.log('all clear to move');
                // if ($window.sessionStorage.error) {
                //     $window.sessionStorage.error = '';
                // }
            }
        });

}]);