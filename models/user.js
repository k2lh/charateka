var mongoose = require('mongoose'),
       bcrypt = require('bcrypt-nodejs'),
       Schema = mongoose.Schema,
       SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    admin: String,
    exempt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    stories: [{
        type: String,
        ref: 'Story'
    }]
}, { timestamps: { createdAt: 'created_at' } });

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);