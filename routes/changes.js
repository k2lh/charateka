var mongoose = require('mongoose');
var router = require('express').Router();

var Schema = mongoose.Schema,
    Event = require('../models/event.js');

// ------------------ remove existing event (update)
router.put('/change/:user_id/:event_id', function(req, res) {
    console.log('remove one change', req.params.user_id);
    Event.update({
        _id: req.params.event_id,
        user_id: req.params.user_id,
        'change._id': req.body._id
    }, {
        $pull: { change: { _id: req.body._id } }
    }, function(err, events) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send("success");
        }
    });
});

// ------------------ view
router.get('/change/:user_id/:event_id', function(req, res) {
    console.log('get events', req.params.user_id);
    Event
    .find({
        user_id: req.params.user_id,
        _id: req.params.event_id
    })
    .populate('story', 'title')
    .sort('order')
    .exec(function(err, event) {
        if (err) {
            return res.json(err);
        } else {
            res.send(event);
        }
    });
});

// ------------------ delete
router.delete('/change/:user_id/:event_id', function(req, res) {
    console.log('delete event', req.params.user_id);
    Event.remove({
        _id: req.params.event_id
    }, function(err) {
        if (err){
            return res.json(err);
        } else {
            console.log('deleted');
            res.status(200).end();
        }
    });
});


module.exports = router;