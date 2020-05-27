var mongoose = require('mongoose');
var router = require('express').Router();

var Schema = mongoose.Schema,
    Story = require('../models/story.js');

// ------------------ create
router.post('/storys/:user_id', function(req, res) {
    console.log('create storys', req.body);
    var story = new Story({
        title: req.body.title,
        user_id: req.params.user_id,
        order: req.body.order
    });
    story.save(function(err) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            Story.find({'user_id':req.params.user_id}, function(err, story) {
                console.log('find story');
                if (err) {
                    console.log(err);
                    return res.json(err);
                } else {
                    res.send(story);
                }
            });
        }
    });
});

// ------------------ update
router.put('/storys/:user_id', function(req, res) {
    console.log('update storys', req.params);
    var story = req.body;
    var user_id = req.params.user_id;
    Story.update({
            _id: req.body._id,
            user_id: req.params.user_id
    }, story, function(err, story) {
        if (err) {
            return res.json(err);
        } else {
            Story
            .find()
            .sort('order')
            .find({'user_id':req.params.user_id}, function(err, story) {
                console.log('find story');
                if (err) {
                    return res.json(err);
                } else {
                    res.send(story);
                }
            });
        }
    });
});

// ------------------ view
router.get('/storys/:user_id', function(req, res) {
    console.log('get storys', req.params);
    Story
    .find({
        user_id: req.params.user_id
    })
    .select({
        title: 1,
        _id: 1,
        order: 1
    })
    .sort('order')
    .exec(function(err, story) {
        if (err) {
            return res.json(err);
        } else {
            res.send(story);
        }
    });
});

// ------------------ delete
router.delete('/storys/:user_id', function(req, res) {
    console.log('delete story', req.params);
    Story.remove({
        user_id: req.params.user_id,
        _id: req.body._id
    }, function(err, story) {
        if (err)
            return res.json(err);
        res.status(200).end();
    });
});

module.exports = router;