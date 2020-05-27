var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    Chara = require('../models/chara.js'),
    Event = require('../models/event.js');
var router = require('express').Router();

// ------------------ ALL TAGS
router.get('/tags/:user_id', function(req, res) {
    var id = req.params.user_id;
    console.log('get tags', req.params);
    Chara
    .find({
        user_id: id,
        tags: { $exists: true, $ne: [] }
    })
    .select({
        tags: 1,
        _id: 0
    })
    .exec(function(err, result) {
        if (err)
            return res.json(err);
        res.send(result);
    });
});

// ------------------ TAG BY NAME
router.get('/tagset/:user_id/:tagname', function(req, res) {
    // view
    var id = req.params.user_id;
    var tagname = req.params.tagname;
    console.log('get individual tags', req.params);
    Chara
    .find({
        user_id: id,
        tags:  tagname
    })
    .select({
        name: 1,
        _id: 1
    })
    .exec(function(err, result) {
        if (err)
            return res.json(err);
        res.send(result);
    });
});

// ------------------ ALL RANKS
router.get('/ranks/:user_id', function(req, res) {
    var id = req.params.user_id;
    console.log('get ranks', req.params);
    Chara
    .find({
        user_id: id,
        rank: { $exists: true, $ne: [] }
    })
    .select({
        rank: 1,
        _id: 0
    })
    .exec(function(err, result) {
        if (err)
            return res.json(err);
        res.send(result);
    });
});

// ------------------ ALL NAMES, TABLE
router.get('/list/:user_id', function(req, res) {
    var id = req.params.user_id;
    console.log('get table list', req.params);
    Chara
    .find({
        user_id: id,
    })
    .select({
        _id: 1,
        aka: 1,
        name: 1,
        age: 1,
        gender: 1,
        rank: 1,
        attends: 1,
        faction: 1,
        adopted: 1,
        legit: 1,
        heir: 1,
        story0pov: 1,
        story0role: 1,
        story0protag: 1,
        story0antag: 1,
        story1pov: 1,
        story1role: 1,
        story1protag: 1,
        story1antag: 1,
        story2pov: 1,
        story2role: 1,
        story2protag: 1,
        story2antag: 1,
        story3pov: 1,
        story3role: 1,
        story3protag: 1,
        story3antag: 1,
        story4pov: 1,
        story4role: 1,
        story4protag: 1,
        story4antag: 1,
        story5pov: 1,
        story5role: 1,
        story5protag: 1,
        story5antag: 1
    })
    .exec(function(err, result) {
        if (err)
            return res.json(err);
        res.send(result);
    });
});

// ------------------ ALL NAMES, ONLY
router.get('/names/:user_id', function(req, res) {
    var id = req.params.user_id;
    console.log('get names list', req.params);
    Chara
    .find({
        user_id: id,
    })
    .select({
        _id: 1,
        name: 1
    })
    .exec(function(err, result) {
        if (err)
            return res.json(err);
        res.send(result);
    });
});


module.exports = router;