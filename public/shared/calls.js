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