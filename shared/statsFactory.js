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