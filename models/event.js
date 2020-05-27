var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema = new Schema({
    order: { type: Number, required: true},
    start: { type: String, trim: true },
    end: { type: String, trim: true },
    title: { type: String, trim: true },
    text: { type: String, trim: true },
    arc: { type: String, trim: true },
    label: { type: String, trim: true },
    follows: {
        type: String, ref: 'Event'
    },
    change: [{
        char_id: { type: String, ref: 'Chara' },
        name: { type: String, trim: true },
        notes: { type: String, trim: true }
    }],
    user_id: {
        type: String, ref: 'User'
    },
    story: {
        type: String, ref: 'Story'
    },
    speak: [{
         type: String, ref: 'Chara'
    }],
    nospeak: [{
        type: String, ref: 'Chara'
    }],
    reffed: [{
        type: String, ref: 'Chara'
    }]

});

module.exports = mongoose.model('Event', EventSchema);