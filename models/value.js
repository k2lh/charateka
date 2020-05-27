var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ValueSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    protags: [ String ],
    faction: [ String ],
    skindetail: [ String ],
    skin: [ String ],
    height: [ String ],
    build: [ String ],
    weight: [ String ],
    gesture: [ String ],
    handed: [ String ],
    movement: [ String ],
    stance: [ String ],
    hairtype: [ String ],
    hairlength: [ String ],
    haircolor: [ String ],
    eyecolor: [ String ],
    eyedetail: [ String ],
    eyebrows: [ String ],
    faceshape: [ String ],
    forehead: [ String ],
    facehair: [ String ],
    nose: [ String ],
    otherface: [ String ],
    lips: [ String ],
    teeth: [ String ],
    outlook: [ String ],
    traits: [ String ],
    fight: [ String ],
    argue: [ String ],
    quirks: [ String ],
    strengthbelief: [ String ],
    romance: [ String ],
    intelligence: [ String ],
    knowledge: [ String ],
    relationquality: [ String ],
    relationtype: [ String ],
    defense: [ String ],
    arcs: [ String ],
    labels: [ String ]
});

module.exports = mongoose.model('Value', ValueSchema);