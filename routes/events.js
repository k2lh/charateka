var mongoose = require('mongoose');
var router = require('express').Router();

var Schema = mongoose.Schema,
    Event = require('../models/event.js');

// ------------------ create multiple
router.post('/events/:user_id', function(req, res) {
    console.log('create many events', req.params);
    var event = new Event(req.body);
    event.save(function(err) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});


// ------------------ view multiple
router.get('/events/:user_id', function(req, res) {
    console.log('get events', req.params);
    Event
    .find({
        user_id: req.params.user_id
    })
    .populate('user_id', '_id')
    .populate('story', 'title')
    .populate('follows', 'title')
    .populate('speak', 'name')
    .populate('nospeak', 'name')
    .populate('reffed', 'name')
    .populate('change')
    .sort('order')
    .exec(function(err, event) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});

// ------------------ view list
router.get('/eventlist/:user_id', function(req, res) {
    console.log('get event list', req.params);
    Event
    .find({
        user_id: req.params.user_id
    })
    .populate('user_id', '_id')
    .populate('story', 'title')
    .sort('order')
    .exec(function(err, event) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});

// ------------------ create one
router.post('/events/:user_id/new', function(req, res) {
    console.log('create one event', req.params);
    var event = new Event(req.body);
    event.save(function(err) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});

// ------------------ update one
router.put('/events/:user_id/:event_id', function(req, res) {
    console.log('update event', req.params);
    var events = req.body;
    Event.update({
        user_id: req.params.user_id,
        _id: req.params.event_id
    }, events, function(err, events) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send("success");
        }
    });
});

// ------------------ view one
router.get('/events/:user_id/:event_id', function(req, res) {
    console.log('get one event', req.params);
    Event
    .find({
        user_id: req.params.user_id,
        _id: req.params.event_id
    })
    .populate('user_id', '_id')
    .populate('story', 'title')
    .populate('follows', 'title')
    .populate('speak', 'name')
    .populate('nospeak', 'name')
    .populate('reffed', 'name')
    .populate('change')
    .sort('order')
    .exec(function(err, event) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});

// ------------------ delete one
router.delete('/events/:user_id/:event_id', function(req, res) {
    console.log('delete event', req.params);
    Event.remove({
        user_id: req.params.user_id,
        _id: req.params.event_id
    }, function(err) {
        if (err){
            console.log(err);
            return res.json(err);
        } else {
            console.log('deleted');
            res.sendStatus(200).end();
        }
    });
});

module.exports = router;