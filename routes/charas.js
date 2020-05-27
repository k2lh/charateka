var mongoose = require('mongoose');
var router = require('express').Router();
var async = require('async');

var Schema = mongoose.Schema,
    Chara = require('../models/chara.js'),
    Event = require('../models/event.js');

// ------------------ ADD CHARACTERS
router.post('/charas/:user_id', function (req, res) {
        console.log('add potatoes');
        var potatoBag = req.body;
        console.log(req.body);
        Chara.collection.insert(potatoBag, function onInsert(err, potatoBag) {
            if (err) {
                return res.json(err);
            } else {
                // console.info('potatoes successfully stored.');
                res.status(200).end();
            }
        });
})

// ------------------ LIST ALL CHARACTERS
router.get('/charas/:user_id/all', function (req, res) {
    var id = req.params.user_id;
    console.log('list all chars');
    Chara
        .find({'user_id':id})
        .exec(function(err, chara) {
        if (err) {
            return res.json(err);
        } else {
            res.send(chara);
        }
    });
});

// ------------------ LIST ALL CHARACTERS for table
router.get('/charas/:user_id', function (req, res) {
    var id = req.params.user_id;
    console.log('list all chars');
    async.parallel([

        function (callback) {
            var query = Chara.find({'user_id':id})
                .select({
                    name: 1,
                    aka: 1,
                    age: 1,
                    gender: 1,
                    faction: 1,
                    rank: 1,
                    attends: 1,
                    attendsid: 1,
                    roles: 1
                }).sort('name');
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

            var list = results[0];
            var dlist = [];
            for (var i = 0; i < list.length; i++ ) {
                var onelist = {
                    _id: list[i]._id,
                    name: list[i].name,
                    age: list[i].age,
                    gender: list[i].gender,
                    faction: list[i].faction,
                    rank: list[i].rank,
                    filter: [],
                    roles: list[i].roles
                };
                if (onelist.roles !== undefined && onelist.roles.length > 0) {
                    var filter = [];
                    for (var j = 0; j < onelist.roles.length; j++ ) {
                        filter.push(onelist.roles[j].story_id);
                    }
                    onelist.filter = filter;
                }
                // console.log(onelist);
                dlist.push(onelist);
            }

            return res.status('200').send(dlist);
    });
});

// ------------------ GET ID FOR CHARACTER
router.get('/charname/:user_id/:chara', function (req, res) {
    var id = req.params.user_id;
    var charname = req.params.chara;
    console.log('retrieve id for added char', req.params);
    Chara
        .find({'user_id':id, 'name': charname})
        .exec(function(err, chara) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(chara);
        }
    });
});

// ------------------ update
router.put('/charas/:user_id/:chara_id', function(req, res) {
    console.log('update chara', req.body.name);
    var character = req.body;
    var charid = req.params.chara_id;
    var bossid = req.body.attendsid;
    var charname = { name: req.body.name };
    Chara.update({_id: charid}, character, function(err, character) {
        if (err) {
            return res.json(err);
        } else if (bossid !== undefined) {
            console.log('boss exists');
            Chara.find({_id: bossid}, {'attendee.name': 1, '_id': 0}, function(err, chara) {
                console.log('add attendant to', req.body.attends);
                var array = chara[0].attendee;
                if (err) {
                    return res.json(err);
                } else if (array === undefined) {
                    console.log('updating boss');
                    console.log('adding charname', charname);
                    Chara.update( {_id: bossid }, {
                        $push: { attendee: {
                            name: req.body.name,
                            id: charid
                        } } }, function(err, character) {
                        if (err) {
                            return res.json(err);
                        } else {
                            res.status(200).end();
                        }
                    });
                } else {
                    // var found = containsObject(charname, array);
                    var i = array.length;
                    var found = false;
                    while(i-- > 0) {
                        if (array[i].name === req.body.name) {
                            console.log(array[i].name, req.body.name);
                            found = true;
                            break;
                        }
                    }
                    if (found === false) {
                        console.log('not found, adding');
                        Chara.update( {_id: bossid }, {
                            $push: { attendee: {
                                name: req.body.name,
                                id: charid
                            } } }, function(err, character) {
                            if (err) {
                                return res.json(err);
                            } else {
                                res.status(200).end();
                            }
                        });
                    }
                    res.status(200).end();
                }
            });
        } else {
            res.status(200).end();
        }
    });
});

// ------------------ view
router.get('/charas/:user_id/:chara_id', function(req, res) {
    console.log('get one char', req.params);
    var id = req.params.user_id;
    var chara_id = req.params.chara_id;
    async.parallel([

        function (callback) {
            var query = Chara.find({ $and: [ {user_id: id}, {'_id':chara_id} ] });
            query.exec(function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        },

        function (callback) {
            var query =
                Event.find({ 'user_id': id }).populate('speak', 'name').populate('nospeak', 'name').populate('reffed', 'name').populate('change')
                .select({
                    story: 1,
                    title: 1,
                    order: 1,
                    change: 1,
                    start: 1,
                    end: 1,
                    reffed: 1,
                    speak: 1,
                    nospeak: 1,
                    _id: 0
                })
                .sort('order');
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

        var history = results[1];
        var charhistory = [];
        for ( var i = 0; i < history.length; i++ ) {
            for (var j = 0; j < history[i].speak.length; j++ ) {
                if (history[i].speak[j]._id == chara_id) {
                    charhistory.push(history[i]);
                }
            }
            for (var k = 0; k< history[i].nospeak.length; k++ ) {
                if (history[i].nospeak[k]._id == chara_id) {
                    charhistory.push(history[i]);
                }
            }
            for (var m = 0; m < history[i].reffed.length; m++ ) {
                if (history[i].reffed[m]._id == chara_id) {
                    charhistory.push(history[i]);
                }
            }
            for (var n = 0; n < history[i].change.length; n++ ) {
                if (history[i].change[n].char_id == chara_id) {
                    charhistory.push(history[i]);
                }
            }
        }

        var charaset = {};
        charaset.character = results[0];
        charaset.history = charhistory;

        return res.status('200').send(charaset);

    });
});

// ------------------ view links
router.get('/charlinks/:user_id/:chara_id', function(req, res) {
    console.log('get one char', req.params);
    var id = req.params.user_id;
    var chara_id = req.params.chara_id;
    async.parallel([

        function (callback) {
            var query = Chara.find({ user_id: id }).where({ 'ochardb.id': chara_id }).select({ _id: 1, name: 1, ochardb: 1});
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

        var set = results[0];
        var links = [];
        for (var i = 0; i < set.length; i++ ){
            for (var j = 0; j < set[i].ochardb.length; j++) {
                if (set[i].ochardb[j].id !== undefined) {
                    var link = {
                        name: set[i].name,
                        id: set[i]._id,
                        category: set[i].ochardb[j].category,
                        view: set[i].ochardb[j].quality,
                        history: set[i].ochardb[j].history
                    }
                    links.push(link);
                }
            }
        }

        return res.status('200').send(links);

    });
});

// ------------------ delete
router.delete('/charas/:user_id/:chara_id', function(req, res) {
    console.log('delete one char', req.params);
    Chara.remove({
        _id: req.params.chara_id
    }, function(err, chara) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).end();
        }
    });
});

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

module.exports = router;
