var mongoose = require('mongoose');
var router = require('express').Router();
var async = require('async');

var Schema = mongoose.Schema,
    Chara = require('../models/chara.js'),
    Story = require('../models/story.js'),
    Event = require('../models/event.js');

// ------------------ OVERALL STATISTICS
router.get('/stats/:user_id', function(req, res) {
        console.log('get chart stats', req.params);
        var id = req.params.user_id;
        async.parallel([

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'woman'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'male'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'trans woman'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'trans male'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'nonbinary'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  {'gender': 'agender'} ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('skin').where({ $or: [ { skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('skin').where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('skin').where({ $or: [ { skin: 'dark-brown' }, { skin: 'dark-gold' }, { skin: 'dark-olive' }, { skin: 'dark-ruddy' } ] }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('skin').where({ skin: 'pale/white' }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('skin').where({ skin: 'dark/black' }).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('age').where('age').lte(15).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('age').where('age').gte(16).lte(30).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('age').where('age').gte(31).lte(50).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('age').where('age').gte(51).lte(75).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ user_id: id }).select('age').where('age').gte(76).lte(100).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

            function (callback) {
            var query = Chara.find({ user_id: id }).select('age').where('age').gte(101).count();
                query.exec(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },

        ],
        function(err, results) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            if (results == null) {
                console.log('no response');
                return res.sendStatus(400);
            }

            var stats = {};
            stats.woman = results[0];
            stats.male= results[1];
            stats.twoman= results[2];
            stats.tmale= results[3];
            stats.nonbinary= results[4];
            stats.agender= results[5];
            stats.light= results[6];
            stats.medium= results[7];
            stats.dark= results[8];
            stats.white= results[9];
            stats.black= results[10];
            stats.age15 = results[11];
            stats.age30 = results[12];
            stats.age50 = results[13];
            stats.age75 = results[14];
            stats.age100 = results[15];
            stats.age101 = results[16];

            return res.status('200').send(stats);

        });
});

// ------------------ STATISTICS BY STORY
router.get('/stats/:user_id/:story_id', function(req, res) {
        var id = req.params.user_id;
        var storyId = req.params.story_id;
        var roles = [ "primary", "secondary", "tertiary", "background", "offpage"];
        var arrgen = [ "woman", "male", "trans woman", "trans male", "nonbinary", "agender" ];
        console.log('get stats by story', req.params);
        async.parallel([


            function (callback) {
                var query = Story.find({ $and: [ {user_id: id}, {_id: storyId} ] }).select({ title: 1, _id: 1, order: 1});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },


        // ---------- COMPILE GENDERS

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[0] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[1] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[2] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[3] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[4] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[5] }, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[0] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[1] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[2] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[3] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[4] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[5] }, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[0] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[1] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[2] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[3] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[4] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[5] }, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[0] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[1] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[2] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[3] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[4] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[5] }, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[0] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[1] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[2] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[3] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[4] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [{ 'user_id': id }, { 'gender' : arrgen[5] }, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

        // --------- COMPILE COLORS

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).where({ skin: 'dark/black' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).where({ skin: 'dark/black' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).where({ skin: 'dark/black' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).where({ skin: 'dark/black' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).where({ skin: 'dark/black' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).where({ $or: [{ skin: 'dark-brown' }, { skin: 'dark-gold' }, { skin: 'dark-olive' }, { skin: 'dark-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).where({ $or: [{ skin: 'dark-brown' }, { skin: 'dark-gold' }, { skin: 'dark-olive' }, { skin: 'dark-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).where({ $or: [ { skin: 'medium-brown' }, { skin: 'medium-gold' }, { skin: 'medium-olive' }, { skin: 'medium-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).where({ $or: [ { skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).where({ $or: [{ skin: 'light-brown' }, { skin: 'light-gold' }, { skin: 'light-olive' }, { skin: 'light-ruddy' } ] }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[0], story_id: storyId} } }] }).where({ skin: 'pale/white' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id},  { roles: { $elemMatch: { role: roles[1], story_id: storyId} } }] }).where({ skin: 'pale/white' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[2], story_id: storyId} } }] }).where({ skin: 'pale/white' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[3], story_id: storyId} } }] }).where({ skin: 'pale/white' }).count();
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                 var query = Chara.find({ $and: [ {user_id: id}, { roles: { $elemMatch: { role: roles[4], story_id: storyId} } }] }).where({ skin: 'pale/white' }).count();
                 query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },


        // --------- COMPILE VOICES

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { speak: { $ne: [] } } ] }).populate('speak').select({'speak': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { speak: { $ne: [] } } ] }).populate('nospeak').select({'nospeak': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { speak: { $ne: [] } } ] }).populate('reffed').select({'reffed': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { speak: { $ne: [] } } ] }).populate('speak').select({'speak': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { nospeak: { $ne: [] } } ] }).populate('nospeak').select({'nospeak': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

            function (callback) {
                var query = Event.find({ $and: [ {user_id: id}, {story: storyId}, { reffed: { $ne: [] } } ] }).populate('reffed').select({'reffed': 1, _id: 0});
                query.exec(function(err, pri) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, pri);
                    }
                });
            },

        ],
        function(err, results) {
            if (err) {
                console.log(err);
                return res.sendStatus(400);
            }
            if (results == null) {
                return res.sendStatus(400);
            }

            var stats = {};

            stats.title = results[0][0].title;
            stats.order = results[0][0].order;
            stats.story = results[0][0]._id;


        // ---------- PREP GENDERS GRAPH

            var arrgen2 = [ "women", "men", "trans women", "trans men", "nonbinary", "agender" ];

            stats.barChartGender = [];
            var set = {
                key: arrgen2[0],
                values: [ { label: roles[0], y: results[1] }, { label: roles[1], y: results[7] }, { label: roles[2], y: results[13] }, { label: roles[3], y: results[19] }, { label: roles[4], y: results[25] } ]
            };
            stats.barChartGender.push(set);
            var set = {
                key: arrgen2[2],
                values: [ { label: roles[0], y: results[3] }, { label: roles[1], y: results[9] }, { label: roles[2], y: results[15] }, { label: roles[3], y: results[21] }, { label: roles[4], y: results[27] } ]
            };
            stats.barChartGender.push(set);
            var set = {
                key: arrgen2[4],
                values: [ { label: roles[0], y: results[5] }, { label: roles[1], y: results[11] }, { label: roles[2], y: results[17] }, { label: roles[3], y: results[23] }, { label: roles[4], y: results[29] } ]
            };
            stats.barChartGender.push(set);
            var set = {
                key: arrgen2[5],
                values: [ { label: roles[0], y: results[6] }, { label: roles[1], y: results[12] }, { label: roles[2], y: results[18] }, { label: roles[3], y: results[24] }, { label: roles[4], y: results[30] } ]
            };
            stats.barChartGender.push(set);
            var set = {
                key: arrgen2[3],
                values: [ { label: roles[0], y: results[4] }, { label: roles[1], y: results[10] }, { label: roles[2], y: results[16] }, { label: roles[3], y: results[22] }, { label: roles[4], y: results[28] } ]
            };
            stats.barChartGender.push(set);
            var set = {
                key: arrgen2[1],
                values: [ { label: roles[0], y: results[2] }, { label: roles[1], y: results[8] }, { label: roles[2], y: results[14] }, { label: roles[3], y: results[20] }, { label: roles[4], y: results[26] } ]
            };
            stats.barChartGender.push(set);

        // ---------- PREP COLORS GRAPH

            var colors = [ "black", "dark", "medium", "light", "white" ];

            stats.barChartColor = [];
            var set = {
                key: colors[4],
                values: [ { label: roles[0], y: results[51] }, { label: roles[1], y: results[52] }, { label: roles[2], y: results[53] }, { label: roles[3], y: results[54] }, { label: roles[4], y: results[55] } ]
            };
            stats.barChartColor.push(set);
            var set = {
                key: colors[3],
                values: [ { label: roles[0], y: results[46] }, { label: roles[1], y: results[47] }, { label: roles[2], y: results[48] }, { label: roles[3], y: results[49] }, { label: roles[4], y: results[50] } ]
            };
            stats.barChartColor.push(set);
            var set = {
                key: colors[2],
                values: [ { label: roles[0], y: results[41] }, { label: roles[1], y: results[42] }, { label: roles[2], y: results[43] }, { label: roles[3], y: results[44] }, { label: roles[4], y: results[45] } ]
            };
            stats.barChartColor.push(set);
            var set = {
                key: colors[1],
                values: [ { label: roles[0], y: results[36] }, { label: roles[1], y: results[37] }, { label: roles[2], y: results[38] }, { label: roles[3], y: results[39] }, { label: roles[4], y: results[40] } ]
            };
            stats.barChartColor.push(set);
            var set = {
                key: colors[0],
                values: [ { label: roles[0], y: results[31] }, { label: roles[1], y: results[32] }, { label: roles[2], y: results[33] }, { label: roles[3], y: results[34] }, { label: roles[4], y: results[35] } ]
            };
            stats.barChartColor.push(set);

        // ---------- PREP VOICES GRAPH by gender

            function getVoices(set, kind, cat, group) {
                var val = 0;
                for (i= 0; i < set.length; i++) {
                    var item = set[i][kind];
                    if (item !== undefined ) {
                        for (j=0; j < item.length; j++) {
                            if (item[j][cat] == group) {
                                val++;
                            }
                        }
                    }
                }
                return val;
            }

            var speakF = getVoices(results[56], 'speak', 'gender', 'woman');
            var speakM = getVoices(results[56], 'speak', 'gender', 'male');
            var speakTM = getVoices(results[56], 'speak', 'gender', 'trans woman');
            var speakTF = getVoices(results[56], 'speak', 'gender', 'trans male');
            var speakNB = getVoices(results[56], 'speak', 'gender', 'nonbinary');
            var speakA = getVoices(results[56], 'speak', 'gender', 'agender');

            var nospeakF = getVoices(results[57], 'nospeak', 'gender', 'woman');
            var nospeakM = getVoices(results[57], 'nospeak', 'gender', 'male');
            var nospeakTM = getVoices(results[57], 'nospeak', 'gender', 'trans woman');
            var nospeakTF = getVoices(results[57], 'nospeak', 'gender', 'trans male');
            var nospeakNB = getVoices(results[57], 'nospeak', 'gender', 'nonbinary');
            var nospeakA = getVoices(results[57], 'nospeak', 'gender', 'agender');

            var reffedF = getVoices(results[58], 'reffed', 'gender', 'woman');
            var reffedM = getVoices(results[58], 'reffed', 'gender', 'male');
            var reffedTM = getVoices(results[58], 'reffed', 'gender', 'trans woman');
            var reffedTF = getVoices(results[58], 'reffed', 'gender', 'trans male');
            var reffedNB = getVoices(results[58], 'reffed', 'gender', 'nonbinary');
            var reffedA = getVoices(results[58], 'reffed', 'gender', 'agender');

            stats.barChartSpeakGender = [];
            var set = {
                key: "women",
                values: [ { label: "speaking", y: speakF }, { label: "non-speaking", y: nospeakF }, { label: "mentioned", y: reffedF } ]
            };
            stats.barChartSpeakGender.push(set);
            var set = {
                key: "trans women",
                values: [ { label: "speaking", y: speakTF }, { label: "non-speaking", y: nospeakTF }, { label: "mentioned", y: reffedTF } ]
            };
            stats.barChartSpeakGender.push(set);
            var set = {
                key: "nonbinary",
                values: [ { label: "speaking", y: speakNB }, { label: "non-speaking", y: nospeakNB }, { label: "mentioned", y: reffedNB } ]
            };
            stats.barChartSpeakGender.push(set);
            var set = {
                key: "agender",
                values: [ { label: "speaking", y: speakA }, { label: "non-speaking", y: nospeakA }, { label: "mentioned", y: reffedA } ]
            };
            stats.barChartSpeakGender.push(set);
            var set = {
                key: "trans men",
                values: [ { label: "speaking", y: speakTM }, { label: "non-speaking", y: nospeakTM }, { label: "mentioned", y: reffedTM } ]
            };
            stats.barChartSpeakGender.push(set);
            var set = {
                key: "men",
                values: [ { label: "speaking", y: speakM }, { label: "non-speaking", y: nospeakM }, { label: "mentioned", y: reffedM } ]
            };
            stats.barChartSpeakGender.push(set);

        // ---------- PREP VOICES GRAPH by color

            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            function getColors(set, kind, cat, group) {
                var val = 0;
                for (i= 0; i < set.length; i++) {
                    var item = set[i][kind];
                    if (item !== undefined ) {
                        for (j=0; j < item.length; j++) {
                            var color = item[j][cat];
                            if (color !== undefined) {
                                if (color.search([group]) > -1) {
                                    val++;
                                }
                            }
                        }
                    }
                }
                return val;
            }

            var speakWh = getColors(results[56], 'speak', 'skin', 'white');
            var speakLi = getColors(results[56], 'speak', 'skin', 'light');
            var speakMed = getColors(results[56], 'speak', 'skin', 'medium');
            var speakDark = getColors(results[56], 'speak', 'skin', 'dark');
            var speakBlk = getColors(results[56], 'speak', 'skin', 'black');

            var nospeakWh = getColors(results[57], 'nospeak', 'skin', 'white');
            var nospeakLi = getColors(results[57], 'nospeak', 'skin', 'light');
            var nospeakMed = getColors(results[57], 'nospeak', 'skin', 'medium');
            var nospeakDark = getColors(results[57], 'nospeak', 'skin', 'dark');
            var nospeakBlk = getColors(results[57], 'nospeak', 'skin', 'black');

            var reffedWh = getColors(results[58], 'reffed', 'skin', 'white');
            var reffedLi = getColors(results[58], 'reffed', 'skin', 'light');
            var reffedMed = getColors(results[58], 'reffed', 'skin', 'medium');
            var reffedDark = getColors(results[58], 'reffed', 'skin', 'dark');
            var reffedBlk = getColors(results[58], 'reffed', 'skin', 'black');

            stats.barChartSpeakColor = [];

            var set = {
                key: "white",
                values: [ { label: "speaking", y: speakWh }, { label: "non-speaking", y: nospeakWh }, { label: "mentioned", y: reffedWh } ]
            };
            stats.barChartSpeakColor.push(set);
            var set = {
                key: "light",
                values: [ { label: "speaking", y: speakLi }, { label: "non-speaking", y: nospeakLi }, { label: "mentioned", y: reffedLi } ]
            };
            stats.barChartSpeakColor.push(set);
            var set = {
                key: "medium",
                values: [ { label: "speaking", y: speakMed }, { label: "non-speaking", y: nospeakMed }, { label: "mentioned", y: reffedMed } ]
            };
            stats.barChartSpeakColor.push(set);
            var set = {
                key: "dark",
                values: [ { label: "speaking", y: speakDark }, { label: "non-speaking", y: nospeakDark }, { label: "mentioned", y: reffedDark } ]
            };
            stats.barChartSpeakColor.push(set);
            var set = {
                key: "black",
                values: [ { label: "speaking", y: speakBlk }, { label: "non-speaking", y: nospeakBlk }, { label: "mentioned", y: reffedBlk } ]
            };
            stats.barChartSpeakColor.push(set);

        // ---------- VOICES TABLE

            stats.freq = {};
            stats.freq.speak = [];
            stats.freq.nospeak = [];
            stats.freq.reffed = [];

            var arr = results[59];
            function setNames(arr, cat) {
                if (arr.length > 0) {
                    var arr2 = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (cat == 'speak') {
                            var arrset = arr[i].speak;
                        } else if (cat == 'nospeak') {
                            var arrset = arr[i].nospeak;
                        } else {
                            var arrset = arr[i].reffed;
                        }
                        for (var j = 0; j < arrset.length; j++) {
                            arr2.push(arrset[j].name);
                        }
                    }
                    arr2.sort();
                    return arr2;
                } else {
                    var x = '';
                    return x;
                }
            }

            var fspeak = setNames(results[59], 'speak');
            var fnospeak = setNames(results[60], 'nospeak');
            var freffed = setNames(results[61], 'reffed');

            stats.freq.speak = getDupes(fspeak);
            stats.freq.nospeak = getDupes(fnospeak);
            stats.freq.reffed = getDupes(freffed);

            return res.status('200').send(stats);
        });
});

module.exports = router;

            function getDupes(arr) {
                var result = {};
                var prev;
                for ( var i = 0; i < arr.length; i++ ) {
                    if ( arr[i] !== prev ) {
                        var key = arr[i];
                        var x = result[i] || {
                            name: key,
                            total: 1
                          };
                    } else {
                        ++x.total
                    }
                    result[key] = x;
                    prev = arr[i];
                }
                var setres = [];
                for (var p in result) {
                    if (result.hasOwnProperty(p)) {
                        setres.push(result[p])
                    }
                }
                // var setone = {};
                // var settwo = {};
                // setone.name = [];
                // settwo.name = [];
                // var a = 0;
                // for(var j = setres.length; j--;) {
                //     if (setres[j].total < 2) {
                //         setone.name.push(setres[j].name);
                //         a++;
                //         setres.splice(j, 1);
                //     }
                // }
                // var setones = {
                //     name: setone.name,
                //     total: a
                // };

                // var b = 0;
                // for(var m = setres.length; m--;) {
                //     if (setres[m].total < 3) {
                //         settwo.name.push(setres[m].name);
                //         b++;
                //         setres.splice(m, 1);
                //     }
                // }
                // var settwos = {
                //     name: settwo.name,
                //     total: b
                // };

                var data = [];
                for (var k = 0; k < setres.length; k++ ) {
                    var ins = {
                        name: setres[k].name,
                        total: setres[k].total
                    }
                    data.push(ins);
                }

                var sets = [];
                sets.push(data);
                // sets.push(setones);
                // sets.push(settwos);
                return sets;
            }
