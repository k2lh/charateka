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
angular.module('app').controller('createAllCtrl', ['$scope', '$http',  'API', '$window', 'storysFactory', 'eventsFactory', 'charactersFactory', 'metaFactory', 'statsFactory',
    function createAllCtrl($scope, $http, API, $window, storysFactory, eventsFactory, charactersFactory, metaFactory, statsFactory) {
    'use strict';

        var userId = $window.sessionStorage.userId;
        var calls = API;
        $scope.storydata =  storysFactory.data;
        $scope.events =  eventsFactory.events;

        $scope.newStory = [];
        $scope.newStory.order = $scope.storydata.storys.length + 1;

        $scope.addStory = function(item) {
            var data = {
                order: item.order,
                title: item.title
            };
            storysFactory.addStory(data);
        };

        $scope.updateStory = function(item) {
            storysFactory.updateStory(item);
        };

        $scope.removeStory = function(item) {
            storysFactory.removeStory(item);
        };

        $scope.newstuff = [];
        $scope.importEvents = function(val) {
            $scope.eventmessage = [];
            if ($scope.events === undefined) {
                var order = 1;
            } else {
                var order = $scope.events.length;
            }
            var arr = [];
            for(var i = 0; i < val.list.length; i++) {
                arr = val.list[i].split("|");
                if (arr.length < 5) {
                    $scope.eventmessage.text = 'It looks like you only have ' + arr.length + ' items in a row. If you want to skip a field, remember to use two pipes || to mark an empty field, including the final field.';
                    $scope.eventmessage.type = 'danger';
                } else {
                    $scope.eventmessage = [];
                    order = order + 1;
                    var arr2 = {
                        order: order,
                        title: arr[0],
                        start: arr[1],
                        end: arr[2],
                        arc: arr[3],
                        label: arr[4],
                        user_id: userId,
                        story: val.story._id
                    };
                    $http({
                        method: 'POST',
                        url: calls.eventsdata,
                        data: arr2,
                        headers: {
                            'x-access-token':  calls.token,
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        $scope.events = response.data;
                    });
                    $scope.eventmessage.text = val.list.length + ' events imported successfully!';
                    $scope.eventmessage.type = 'success';
                    $scope.newstuff = [];
                    }
            }
        };

        $scope.importCharas = function(list) {
            $scope.charamessage = [];
            var bulk = [];
            var arr = [];
            for(var i = 0; i < list.length; i++) {
                arr = list[i].split("|");
                if (arr.length < 3) {
                    $scope.charamessage.text = 'It looks like you only have ' + arr.length + ' items in a row. Remember to use two pipes || to mark an empty value.';
                    $scope.charamessage.type = 'danger';
                    break;
                } else {
                    $scope.eventmessage = [];
                    var base = {
                        name: arr[0],
                        age: arr[1],
                        gender: arr[2],
                        user_id: userId,
                        ochardb: [],
                        tags: [],
                        attendee: [],
                        storyset: []
                    };
                    bulk.push(base);
                }
            }
            if (bulk.length > 0) {
                // $http({
                //     method: 'POST',
                //     url: calls.charadata,
                //     data: bulk,
                //     headers: {
                //         'x-access-token':  calls.token,
                //         'Content-Type': 'application/json'
                //     }
                // }).then(function () {
                //     $scope.charamessage.text = list.length + ' characters imported successfully!';
                //     $scope.charamessage.type = 'success';
                //     $scope.list = [];
                //     metaFactory.getNames();
                // });
                charactersFactory.addCharacters(bulk);
            }
        };


}]);
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
angular.module('app').controller('editEventCtrl', ['$scope', '$http', 'API', 'eventsFactory',  '$window',  '$routeParams', 'storysFactory', 'metaFactory',  '$location', 'charactersFactory',
    function editEventCtrl($scope, $http, API, eventsFactory, $window,  $routeParams, storysFactory, metaFactory, $location, charactersFactory) {
    'use strict';

        var calls = API;
        var eventId = $routeParams.eventId;
        var userId = $window.sessionStorage.userId;
        eventsFactory.getEvent(eventId);

        $scope.changeValue = 0;
        $scope.metaFactory = metaFactory.meta;
        $scope.storysFactory = storysFactory.data;
        $scope.editevent = eventsFactory.data;
        // $scope.totalevent = $scope.events.length;

        $scope.updateEvent = function(item) {
            var change = [];
            for(var i = 0; i < item.change.length; i++) {
                if (item.change[i].name.name !== undefined) {
                    var achange = {
                        char_id: item.change[i].name._id,
                        name: item.change[i].name.name,
                        notes: item.change[i].notes
                    };
                    change.push(achange);
                } else if (item.change[i].name !== '') {
                    change.push(item.change[i]);
                }
            }
            if (change !== undefined) {
                item.change = change;
            }
            eventsFactory.updateEvent(item);
        };

        $scope.confirmEvent = function(item) {
            if (item.title === undefined || item.story === undefined ) {
                eventsFactory.removeEvent(item._id);
                $location.path('/view-events');
            }
        };

        $scope.removeEvent = function(item) {
            eventsFactory.removeEvent(item._id);
            $location.path('/view-events');
        };

        $scope.removeChange = function(item, ind) {
            $scope.editevent.eventone.change.splice(ind, 1);
        };

        $scope.addChanges = function() {
            $scope.editevent.eventone.change.push({'name': ''});
        };

        $scope.removeChar = function(arr, item) {
            move(arr, item);
        };

        $scope.addNewCharLine = false;
        $scope.addChar = function(arr, item, cat, box) {
            if (typeof item == 'string') {
                $scope.addNewCharLine = true;
                $scope.character = {
                    user_id: userId,
                    name: item,
                    box: box,
                    roles: [{
                        story_id: $scope.editevent.eventone.story._id,
                        appears: true,
                        role: cat
                    }]
                };
            } else {
                arr.push(item);
            }
        };

        $scope.addNewChar = function(item, set) {
            var bulk = [];
            var cat = item.box;
            bulk.push(item);
            charactersFactory.addCharacters(bulk);
            $scope.character= {};
            $scope.addNewCharLine = false;
            // get id, add to list of chars
            $http({
                method: 'GET',
                url: calls.chariddata + '/' + item.name,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                var speaknew = {
                    _id: response.data[0]._id,
                    name: item.name
                };
                set[cat].push(speaknew);
            });
        }

        $scope.cancelChar = function(item)  {
            $scope.addNewCharLine = false;
            $scope.character.name = '';
        };

        function move(arr, val) {
            var j = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].name === val.name) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        }

}]);
angular.module('app').controller('editValuesCtrl', ['$scope', 'metaFactory',
    function editValuesCtrl($scope, metaFactory) {
    'use strict';

        $scope.metaFactory = metaFactory.meta;

        $scope.updateValues = function(item) {
            delete item._id;
            metaFactory.updateValues(item);
        };

}]);
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

angular.module('app').controller('viewDataCtrl', ['$scope', 'charactersFactory', 'eventsFactory',
    function viewDataCtrl($scope, charactersFactory, eventsFactory) {
    'use strict';

        $scope.eventsFactory = eventsFactory.data;

        $scope.charactersFactory = charactersFactory.data;
        charactersFactory.getAllCharacters();


}]);

angular.module('app').controller('viewEventsCtrl', ['$scope', '$http', 'API', 'eventsFactory', 'metaFactory', 'storysFactory', '$window',
    function viewEventsCtrl($scope, $http, API, eventsFactory, metaFactory, storysFactory, $window) {
    'use strict';

        var userId = $window.sessionStorage.userId;
        var calls = API;

        $scope.selectFilter = {};
        $scope.selectFilter.arc = '';
        $scope.selectFilter.label = '';

        $scope.metaFactory = metaFactory.meta;
        $scope.storysFactory = storysFactory.data;
        $scope.eventsFactory = eventsFactory.data;
        if ($scope.eventsFactory.events === undefined) {
            $scope.totalevent = 0;
            console.log('no events');
        } else {
            $scope.totalevent = Object.keys($scope.eventsFactory.events).length;
            // $scope.totalevent = $scope.eventsFactory.events.length;
            console.log('have events', $scope.totalevent);
        }

        $scope.checkOrder = function(event, ind) {
            $scope.checked = {};
            if (event.follows === undefined) {
                changeOrderCall(event, ind);
            } else {
                $scope.orderBefore = getOrderFollows($scope.eventsFactory.events, '_id', event.follows._id);
                if ($scope.orderBefore < event.order) {
                    changeOrderCall(event, ind);
                } else {
                    $scope.checked[ind] = true;
                    $scope.followsTitle = event.follows.title;
                }
            }
        };

        $scope.changeOrder = function(event, ind) {
            changeOrderCall(event, ind);
        };

        $scope.resetOrder = function(ind) {
            $scope.checked[ind] = false;
            eventsFactory.getEventsList();
        };

        function getOrderFollows(arraytosearch, key, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i][key] == valuetosearch) {
                    return arraytosearch[i].order;
                }
            }
        }

        function changeOrderCall(event, ind) {
            $scope.checked[ind] = false;
            $http({
                method: 'PUT',
                url: calls.eventsdata + '/' + event._id,
                data: event,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                eventsFactory.getEventsList();
            });
        }

        $scope.makeNew = function() {
            var order = $scope.totalevent + 1;
            var item = {
                order: order,
                user_id: userId,
                change: [{"name": ""}],
                speak: [],
                nospeak: [],
                reffed: []
            };
            eventsFactory.addEvent(item);
        };

        $scope.reorder = function() {
            for (var i = 0; i < $scope.eventsFactory.events.length; i++) {
                console.log($scope.eventsFactory.events.length);
                $scope.eventsFactory.events[i].order = (i +1);
                $scope.checked = [];
                changeOrderCall($scope.eventsFactory.events[i], i);
            }
        };

}]);


angular.module('app').controller('viewInfoCtrl', [
    function viewInfoCtrl() {
    'use strict';


}]);
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
angular.module('app').controller('viewSummaryCtrl', ['$scope', 'eventsFactory', 'storysFactory',
    function viewSummaryCtrl($scope, eventsFactory, storysFactory) {
    'use strict';

        $scope.data = eventsFactory.data;
        $scope.storysFactory = storysFactory.data;
        $scope.summarytext = false;

}]);
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

angular.module('appLogin').factory('authService', ['$http', '$rootScope' , '$location', '$localStorage', '$window', '$httpParamSerializerJQLike',
    function ($http, $rootScope, $location, $localStorage, $window, $httpParamSerializerJQLike) {
        'use strict';

        var service = {};
        service.error = [];

        service.login = function (username, password) {
            return $http({
               method: 'POST',
               url: '/api/authenticate',
               data: $httpParamSerializerJQLike({
                    "username": username,
                    "password": password
               }),
               headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
               }
            }).then(function (response) {
                if(response.data.token) {
                    var userId = response.data.userId;
                    var token = response.data.token;
                    $window.sessionStorage.token = token;
                    $window.sessionStorage.userId = userId;
                    $http({
                        method: 'GET',
                        url: '/api/values/' + userId,
                        headers: {
                            'x-access-token':  token
                        }
                    }).then(function (response) {
                        $localStorage.values = response.data[0];
                        $window.location.href = '/home.html';
                    }).catch(function(response) {
                        service.error = response;
                    });
                } else {
                    service.error = response;
                }
            }).catch(function(response) {
                service.error = response;
            });
        };

        service.register = function(username, password, email) {
            return $http({
               method: 'POST',
               url: '/api/register',
               data: $httpParamSerializerJQLike({
                    "username": username,
                    "password": password,
                    "email": email
               }),
               headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
               }
            }).success(function (response) {
                if(response == 'success') {
                    $location.path('/login/registered');
                } else {
                    $scope.error = "Something went wrong!" + response;
                }
            });
        };

        service.ClearCredentials = function () {
            $window.sessionStorage.clear();
           $window.location.href = '/index.html';
        };

        return service;
}]);
angular.module('app').factory('API', ['$window',
    function API($window) {
        'use strict';

        var   userId = $window.sessionStorage.userId,
                href = 'http://localhost:8080/api/';

        return {

            token: $window.sessionStorage.token,
            userId: $window.sessionStorage.userId,
            base: href,

            charadata: href + 'charas/' + userId,
            storydata: href + 'storys/' + userId,
            valuesdata: href + 'values/' + userId,
            ranksdata: href + 'ranks/' + userId,
            namesdata: href + 'names/' + userId,
            eventsdata: href + 'events/' + userId,
            eventlistdata: href + 'eventlist/' + userId,

            changedata: href + 'change/' + userId,
            tagdata: href + 'tags/' + userId,
            onetagdata: href + 'tagset/' + userId,
            historydata: href + 'history/' + userId,
            statsdata: href + 'stats/' + userId,
            chariddata: href + 'charname/' + userId,
            charalinkdata: href + 'charlinks/' + userId,
        };

    }
])

.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
            return filtered;
    };
});
angular.module('app').factory('charactersFactory', ['$http', 'API', 'eventsFactory', 'metaFactory',
    function charactersFactory($http, API, eventsFactory, metaFactory) {
        'use strict';

        var calls = API;
        var service = {};
        var eventsFactory = eventsFactory.data;

        service.data = {};
        service.data.onlyone = '';
        service.data.characterlist = [];
        service.data.allcharacters = [];

        service.data.chara = {};
        service.data.chara.character = {};
        service.data.chara.history = [];
        service.data.chara.roles = {};

        service.addCharacters = function(item) {
            return $http({
                method: 'POST',
                url: calls.charadata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getCharacterList();
            });
        };

        service.addOneChara = function(item) {
            return $http({
                method: 'POST',
                url: calls.charadata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.data.onlyone = response._id;
            });
        };

        service.getCharacterList = function() {
            return $http({
                method: 'GET',
                url: calls.charadata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.characterlist = response.data;
                metaFactory.getNames();
            });
        };

        service.getAllCharacters = function() {
            return $http({
                method: 'GET',
                url: calls.charadata + '/all',
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.allcharacters = response.data;
            });
        };

        service.getChara = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.charadata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                service.data.chara.character = data.character[0];
                service.data.chara.history = data.history;
                if (data.character[0].ochardb.length < 1) {
                    service.data.chara.character.ochardb.push({'name': ''});
                }
                service.getCharaLinks(itemId);
            });
        };

        service.getCharaLinks = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.charalinkdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                service.data.chara.charlinks = data;
            });
        };

        service.updateChara = function(item) {
            return $http({
                method: 'PUT',
                url: calls.charadata + '/' + item._id,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getCharacterList();
            });
        }

        service.deleteChara = function(itemId) {
            // service.deleteRole(itemId);
            return $http({
                method: 'DELETE',
                url: calls.charadata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token
                }
            })
            .then(function (response) {
                service.getCharacterList();
            });
        }

        service.getCharacterList();

        return service;
    }
]);

angular.module('app').factory('eventsFactory', ['$http', 'API', '$location',
    function eventsFactory($http, API, $location) {
        'use strict';

        var calls = API;
        var service = {};
        service.data = {};
        service.data.events = {};
        service.data.eventone = {};

        // multiple events actions

        service.getAllEvents = function() {
            return $http({
                method: 'GET',
                url: calls.eventsdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.events = response.data;
            });
        };

        service.getEventsList = function() {
            return $http({
                method: 'GET',
                url: calls.eventlistdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.list = response.data;
            });
        };

        service.bulkEvents = function(item) {
            return $http({
                method: 'POST',
                url: calls.eventsdata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.removeChange = function(item, eventId) {
            return $http({
                method: 'PUT',
                url: calls.changedata + '/' + eventId,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        }

        // single event actions

        service.getEvent = function(itemId) {
            return $http({
                method: 'GET',
                url: calls.eventsdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.eventone = response.data[0];
                service.data.eventone.change.push({'name': ''});
            });
        };


        service.addEvent = function(item) {
            return $http({
                method: 'POST',
                url: calls.eventsdata + '/new',
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.data.eventone = response.data;
                $location.path('/edit-event/' + response.data._id);
            });
        };

        service.updateEvent = function(item) {
            return $http({
                method: 'PUT',
                url: calls.eventsdata + '/' + item._id,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.removeEvent = function(itemId) {
            return $http({
                method: 'DELETE',
                url: calls.eventsdata + '/' + itemId,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getEventsList();
            });
        };

        service.getEventsList();
        service.getAllEvents();

        return service;

    }
]);
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


angular.module('app').factory('metaFactory', ['$http', 'API',
    function metaFactory($http, API) {
        'use strict';

        var calls = API;
        var service = {};
        service.meta = {};
        service.meta.values = {};
        service.meta.names = [];
        service.meta.ranks = [];
        service.meta.tags = [];

        service.getValues = function() {
            return $http({
            method: 'GET',
            url: calls.valuesdata,
            headers: {
                'x-access-token':  calls.token
            }
            }).then(function (response) {
                service.meta.values =  response.data[0];
            });
        };

        service.getNames = function() {
            return $http({
                method: 'GET',
                url: calls.namesdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                // var data = response.data;
                // var allNames = [];
                // for (var i = 0; i < data.length; i++) {
                //    if (data[i].aka !== undefined && data[i].aka.length > 0) {
                //        allNames.push({
                //             name: data[i].aka,
                //             _id: data[i]._id
                //        });
                //    } else {
                //         allNames.push({
                //             name: data[i].name,
                //             _id: data[i]._id
                //         });
                //    }
                // }
                service.meta.names = response.data;
            });
        };

        service.getRanks = function() {
            var arr = [];
            var arr2 = [];
            return $http({
                method: 'GET',
                url: calls.ranksdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                var data = response.data;
                for(var i = 0; i < data.length; i++) {
                    var rank = data[i].rank.toLowerCase();
                    if ( rank !== undefined) {
                        if (rank.indexOf(", ") > -1) {
                            var split = rank.split(", ");
                            for (var j = 0; j < split.length; j++) {
                                split[j] = split[j].replace(/^\s+|\s+$/g,'');
                            }
                            arr2 = arr2.concat(split);
                        } else {
                            arr2.push(rank);
                        }
                    }
                }
                for(i = 0; i < arr2.length; i++) {
                    if(arr.indexOf(arr2[i]) == -1) {
                        arr2[i].replace(/^\s+|\s+$/g,'');
                       arr.push(arr2[i]);
                    }
                }
                arr.sort();
                service.meta.ranks = arr;
            });
        };

        service.getTags = function() {
            var arr = [];
            return $http({
                method: 'GET',
                url: calls.tagdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                var data = response.data;
                for(var i = 0; i < data.length; i++) {
                    var group = data[i].tags;
                    if (group !== undefined){
                        for(var x = 0; x < group.length; x++) {
                            if(arr.indexOf(group[x]) == -1) {
                                var item = group[x].toLowerCase();
                               arr.push(item);
                            }
                        }
                    }
                }
                var taglist = arr;
                taglist.sort();
                service.meta.tags = taglist;
            });
        };

        service.updateValues = function(item) {
            return $http({
                method: 'PUT',
                url: calls.valuesdata,
                data: item,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.getValues();
            });
        }

        service.getValues();
        service.getNames();
        service.getRanks();
        service.getTags();

        return service;

    }
]);
angular.module('app').factory('statsFactory', ['$http', 'API', '$localStorage', 'storysFactory',
    function statsFactory($http, API, $localStorage, storysFactory) {
        'use strict';

        var calls = API;
        var storydata =  storysFactory.data;

        var service = {};
        service.data = {};
        service.data.allStats = [];

        service.data.piechart1 = [];
        service.data.piechart2 = [];
        service.data.piechart3 = [];
        service.data.piechart4 = [];

        service.data.optionspie = {
            chart: {
                type: 'pieChart',
                height: 400,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                growOnHover: true,
                labelsOutside: true,
                duration: 500,
                labelThreshold: 0.01,
                valueFormat: function (d) { return d },
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                "color": [
                    "#fff191",
                    "#efb150",
                    "#da532f",
                    "#b80909",
                    "#a10833",
                    "#89025e"
                ]
            }
        };

        service.data.optionsbar = {
            chart: {
                type: 'multiBarChart',
                height: 300,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 45
                },
                clipEdge: true,
                duration: 500,
                stacked: true,
                showControls: false,
                staggerLabels: false,
                reduceXTicks: false,
                rotateLabels: 45,
                x: function(d){return d.label;},
                xAxis: {
                    axisLabel: '',
                    showMaxMin: false,
                    tickFormat: function (d) { return d }
                },
                yAxis: {
                    axisLabel: '# of characters',
                    axisLabelDistance: -20,
                    tickFormat: function (d) { return d }
                },
                "color": [
                    "#fff191",
                    "#efb150",
                    "#da532f",
                    "#b80909",
                    "#a10833",
                    "#89025e"
                ]
            }
        };

        service.getStats = function() {
            return $http({
                method: 'GET',
                url: calls.statsdata,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                service.data.stats = response.data;
                service.getChart1();
                service.getChart2();
                service.getChart3();
            });
        };

        service.getAllStats = function(id) {
            service.data.allStats = [];
            // var storys = $localStorage.storys;
            // for(var i = 0; i < storys.length; i++) {
            //     var id = storys[i]._id;
            $http({
                method: 'GET',
                url: calls.statsdata + '/' + id,
                headers: {
                    'x-access-token':  calls.token
                }
            }).then(function (response) {
                var data = {
                    id: response.data.story,
                    order: response.data.order,
                    data: response.data
                }
                service.data.allStats.push(data);
            });
        };

        service.getChart1 = function() {
            service.data.piechart1 = [
                { key: 'women',  y: service.data.stats.woman},
                { key: 'trans women', y: service.data.stats.tmale},
                { key: 'nonbinary', y: service.data.stats.nonbinary},
                { key: 'agender', y: service.data.stats.agender},
                { key: 'trans men', y: service.data.stats.twoman},
                { key: 'men',  y: service.data.stats.male}
            ];
        };

        service.getChart2 = function() {
            service.data.piechart2 = [
                { key: '0-15', y: service.data.stats.age15},
                { key: '16-30', y: service.data.stats.age30},
                { key: '31-50', y: service.data.stats.age50},
                { key: '51-75', y: service.data.stats.age75},
                { key: '76-100', y:  service.data.stats.age100},
                { key: '100+', y: service.data.stats.age101}
            ];
        };

        service.getChart3 = function() {
            service.data.piechart3 = [
                { key: 'white', y: service.data.stats.white},
                { key: 'light', y: service.data.stats.light},
                { key: 'medium', y: service.data.stats.medium},
                { key: 'dark', y: service.data.stats.dark},
                { key: 'black', y: service.data.stats.black}
            ];
        }

        // service.getChart4 = function() {
        //     service.data.piechart4 = service.data.allStats.freq.speak;
        // }

        // service.getStats();
        // service.getAllStats();

        return service;


    }
]);
angular.module('app').factory('storysFactory', ['$http', 'API',  '$q', '$localStorage',
    function storysFactory($http, API,  $q, $localStorage) {
        'use strict';

        var calls = API;
        var service = {};
        service.data = {};
        service.data.storys = [];

        service.getStoryList = function() {
            return $http({
            method: 'GET',
            url: calls.storydata,
            headers: {
                'x-access-token':  calls.token
            }
            }).then(function (response) {
                service.data.storys = response.data;
                $localStorage.storys = response.data;
            });
        };

        service.addStory = function(item) {
            return $http({
                method: 'POST',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                //  return( request.then( handleSuccess, handleError ) );
                service.getStoryList();
            });
        };

        service.updateStory = function(item) {
            return $http({
                method: 'PUT',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getStoryList();
            });
        };

        service.removeStory = function(item) {
            return $http({
                method: 'DELETE',
                url: calls.storydata,
                data: item,
                headers: {
                    'x-access-token':  calls.token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                service.getStoryList();
            });
        }

        function handleError( response ) {
            if ( ! angular.isObject( response.data ) || ! response.data.message ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            return( response.data );
        }

        service.getStoryList();

        return service;
    }
]);
/* jshint undef:true, unused:true, latedef:false */
/* global app */

angular.module('app').factory('varsFactory', [
    function varsFactory() {
        'use strict';

        var factory = {
            gender: [
                "woman", "male", "trans woman", "trans male", "nonbinary", "agender"
            ],
            role: [
                "primary", "secondary", "tertiary", "background", "offpage"
            ],
            participation: [
                "speaking", "non-speaking", "is mentioned"
            ],
            skin: [
                "dark/black",
                "dark-brown",
                "dark-gold",
                "dark-olive",
                "dark-ruddy",
                "medium-brown",
                "medium-gold",
                "medium-olive",
                "medium-ruddy",
                "light-brown",
                "light-gold",
                "light-olive",
                "light-ruddy",
                "pale/white"
            ],
            listValues: [
                "faction",
                "skindetail",
                "skin",
                "height",
                "build",
                "weight",
                "gesture",
                "handed",
                "movement",
                "stance",
                "hairtype",
                "hairlength",
                "haircolor",
                "eyecolor",
                "eyedetail",
                "eyebrows",
                "faceshape",
                "forehead",
                "facehair",
                "nose",
                "otherface",
                "lips",
                "teeth",
                "outlook",
                "traits",
                "fight",
                "argue",
                "quirks",
                "strengthbelief",
                "romance",
                "intelligence",
                "knowledge",
                "relationship",
                "defense"
            ]
        };

        return factory;

    }
]);