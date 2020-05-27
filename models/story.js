var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StorySchema = new Schema({
    user_id: {
        type: String,
        ref: 'User'
    },
    order: {
        type: Number,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    event: [{
        type: String,
        ref: 'Event'
    }]
});

module.exports = mongoose.model('Story', StorySchema);