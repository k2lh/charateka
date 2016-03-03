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