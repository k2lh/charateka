var mongoose = require('mongoose');
var router = require('express').Router();

var Schema = mongoose.Schema,
    Value = require('../models/value.js');

// ------------------ create
router.post('/values/:user_id', function(req, res) {
    console.log('create values', req.params);
    var task = req.body;
    var value = new Value(task);
    value.save(function(err) {
        if (err) {
            return res.json(err);
        } else {
            res.send("success");
        }
    });
});

// ------------------ update
router.put('/values/:user_id', function(req, res) {
    console.log('update values', req.params);
    var values = req.body;
    var user_id = req.params.user_id;
    console.log(user_id);
    Value.update({user_id: user_id}, values, function(err, values) {
        if (err) {
            return res.json(err);
        } else {
            res.send("success");
        }
    });
});

// ------------------ view
router.get('/values/:user_id', function(req, res) {
    console.log('get values', req.params);
    var id = req.params.user_id;
    Value.find({'user_id':id}, function(err, value) {
        if (err) {
            return res.json(err);
        } else {
            res.send(value);
        }
    });
});

// ------------------ delete
router.delete('/values/:user_id', function(req, res) {
    Value.remove({
        user_id: req.params.user_id
    }, function(err, value) {
        if (err)
            return res.json(err);
        res.status(200).end();
    });
});

module.exports = router;