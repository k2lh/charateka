var express = require('express');
var app = express();
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var config = require('./config');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var async = require('async');
var session = require('express-session');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'afishtrap@gmail.com',
        pass: 'oxjakpykiqvsjnmu'
    }
});

app.set('superSecret', config.secret);
app.set('trust proxy', 1);

app.use(session({
    secret: 'ifthisislowimlookingforthehigh',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 }
}));


var Schema = mongoose.Schema,
    Value = require('./models/value.js'),
    User = require('./models/user.js'),
    Chara = require('./models/chara.js'),
    Story = require('./models/story.js'),
    Event = require('./models/event.js');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

router.post('/charas/:user_id', require('./routes/charas'));
router.get('/charas/:user_id', require('./routes/charas'));
router.get('/charas/:user_id/all', require('./routes/charas'));
router.get('/charname/:user_id/:name', require('./routes/charas'));
router.get('/charlinks/:user_id/:name', require('./routes/charas'));
router.put('/charas/:user_id/:chara_id', require('./routes/charas'));
router.get('/charas/:user_id/:chara_id', require('./routes/charas'));
router.delete('/charas/:user_id/:chara_id', require('./routes/charas'));

router.post('/storys/:user_id', require('./routes/storys'));
router.put('/storys/:user_id', require('./routes/storys'));
router.get('/storys/:user_id', require('./routes/storys'));
router.delete('/storys/:user_id', require('./routes/storys'));

router.post('/values/:user_id', require('./routes/values'));
router.put('/values/:user_id', require('./routes/values'));
router.get('/values/:user_id', require('./routes/values'));
router.delete('/values/:user_id', require('./routes/values'));

router.post('/events/:user_id', require('./routes/events'));
router.put('/events/:user_id', require('./routes/events'));
router.get('/events/:user_id', require('./routes/events'));
router.delete('/events/:user_id', require('./routes/events'));

router.post('/events/:user_id/new', require('./routes/events'));
router.put('/events/:user_id/:event_id', require('./routes/events'));
router.get('/events/:user_id/:event_id', require('./routes/events'));
router.get('/eventlist/:user_id', require('./routes/events'));
router.delete('/events/:user_id/:event_id', require('./routes/events'));

router.post('/changes/:user_id/:event_id', require('./routes/changes'));
router.put('/changes/:user_id/:event_id', require('./routes/changes'));
router.get('/changes/:user_id/:event_id', require('./routes/changes'));
router.delete('/changes/:user_id/:event_id', require('./routes/changes'));

router.get('/stats/:user_id', require('./routes/stats'));
router.get('/stats/:user_id/:story_id', require('./routes/stats'));

router.get('/tags/:user_id', require('./routes/meta'));
router.get('/tagset/:user_id/:tagname', require('./routes/meta'));
router.get('/ranks/:user_id', require('./routes/meta'));
router.get('/list/:user_id', require('./routes/meta'));
router.get('/names/:user_id', require('./routes/meta'));

// ------------------ TRACKING
router.use(function(req, res, next) {
    console.log('------------------------- NEW CALL ------------------------ ');
    next(); // don't stop here
});
// ------------------ USER REGISTER
router.route('/register')
    .post(function(req, res) {
        var user = new User();
        console.log('register', req.body.username);
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        transporter.sendMail({
            from: 'charateka <afishtrap@gmail.com>',
            to: req.body.email,
            subject: 'charateka registration',
            bcc: 'afishtrap@gmail.com',
            text: 'Hello! You have successfully registered at charateka as ' + req.body.username + '. \n\n' +
                'Please keep your password handy and don\'t forget it, because the password reset fuction is under construction. \n' +
                'Remember, the application is still in development, so please don\'t enter anything you don\'t want to risk losing as \n' +
                'the database/site is updated and developed. Thanks for your patience! \n\n'
        });
        user.save(function(err) {
            if (err) {
                return res.json(err);
            } else {
                console.log('creating new...');
                var id = user._id;
                allvalues.user_id = id;
                var value = new Value(allvalues);
                value.save(function(err) {
                    if (err) {
                        return res.json(err);
                    } else {
                        return res.send("success");
                    }
                });
            }
        });
});
// ------------------ USER RESET PWD
router.route('/forgot')
    .post(function(req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                console.log('reset', req.body.email);
                User.find({
                    email: req.body.email
                }, function(err, user) {
                    if (!user) {
                        res.json({ success: false, message: 'Sorry, that email address is not registered.' });
                    } else {
                        user[0].resetPasswordToken = token;
                        user[0].resetPasswordExpires = Date.now() + 3600000;
                        var uuser = user[0];
                        User.update({
                            _id: user._id
                        }, uuser, function(err, user) {
                            done(err, token, user);
                        });
                    }
                });
            },
            function(token, user, done) {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'afishtrap@gmail.com',
                    subject: 'charateka Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/index.html#/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                });
                return res.json({ success: true, message: 'Check your email for the reset link.'});
            }
        ], function(err) {
            if (err) return next(err);
        });

});

    // check token
    router.route('/reset/:token')
        .get(function(req, res) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            }, function(err, user) {
                if (!user) {
                    return res.send({ success: false, message: 'Password reset token is invalid or has expired.'});
                } else {
                    return res.send({ success: true});
                }
            });
    });

    // save new password
    router.route('/reset/:token')
        .post(function(req, res) {
            async.waterfall([
                function(done) {
                    console.log(req.body.password, req.params.token);
                    User.find({
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() }
                    }, function(err, user) {
                        console.log('user', user);
                        if (user.length < 1) {
                            res.send({success: false, message: 'Password reset token is invalid or has expired.'});
                        } else {
                            user.password = req.body.password;
                            // user.resetPasswordToken = undefined;
                            // user.resetPasswordExpires = undefined;
                            User.update(function(err) {
                                done(err, user);
                            });
                        }
                    });
                },
                function(user, done) {
                    transporter.sendMail({
                        to: user.email,
                        from: 'afishtrap@gmail.com',
                        subject: 'charateka password has been changed',
                        text: 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                    });
                    return res.json({ success: true, message: "Password successfully changed."});
                }
        ], function(err) {
            if (err) return next(err);
        });
    });

// ------------------ AUTHENTICATE
router.post('/authenticate', function(req, res, next) {

    User.findOne({username: req.body.username}, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' }).end();
                } else {
                    console.log(req.body.password, isMatch);
                    console.log(' ====> yesssssssss', req.body.username);
                    var user_id = user._id;
                    var intro = user.intro;
                    var admin = user.admin;
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 604800
                    });
                    res.json({
                        success: true,
                        token: token,
                        userId: user_id
                    }).end();
                }
            });
        }
    });
});
// ------------------ CHECK TOKEN
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
          console.log('BAD token');
          res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
          console.log('GOOD token');
          req.decoded = decoded;
          next();
      }
    });
  } else {
      res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});
// ------------------ USER WITH ID
router.route('/users/:user_id')
    // view
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) {
                return res.json(err).end();
            } else {
                return res.json(user).end();
            }
        });
    })
    // update
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            console.log('updating user');
            if (err)
                return res.json(err);
            user.intro = req.body.intro;
            if (!user.intro) {
                user.username = req.body.username;
                user.password = req.body.password;
            }
            user.save(function(err) {
                if (!err) {
                    res.status(200).end();
                } else { 
                    return res.json(err).end();
                }
            });
        });
    })
    // delete
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) {
                return res.json(err);
            } else {
                console.log('remove user');
                Value.remove({
                    user_id: req.params.user_id
                }, function(err, value) {
                    if (err) {
                        return res.json(err);
                    } else {
                        console.log('remove values');
                        Chara.remove({
                            user_id: req.params.user_id
                        }, function(err, chara) {
                            if (err) {
                                res.send(err);
                            } else {
                                console.log('remove charas');
                                res.status(200).end();
                            }
                        });
                    }
                });
            }
            res.send('deleted');
        });
});

// ------------------ REGISTER ROUTES & START SERVER
app.use('/api', router);
app.listen(port);
console.log('gogogo port ' + port);

var allvalues = {
    "user_id": "",
  "protags": [
  ],
  "faction": [
    "North",
    "South",
    "East",
    "West"
  ],
  "skindetail": [
    "burned",
    "flushed",
    "freckled",
    "pocked",
    "reddened",
    "rough",
    "sallow",
    "sickly",
    "smooth",
    "tanned",
    "wrinkled",
    "acne scars",
    "a birthmark"
  ],
  "skin": [
    "dark-black",
    "dark-brown",
    "dark-gold",
    "dark-olive",
    "dark-ruddy",
    "medium-brown",
    "medium-gold",
    "medium-olive",
    "medium-ruddy",
    "light-brown",
    "light-gold",
    "light-olive",
    "light-ruddy",
    "light-white"
  ],
  "height": [
    "very tall",
    "taller than average",
    "of average height",
    "shorter than average",
    "very short"
  ],
  "build": [
    "small-boned",
    "medium, solid",
    "big-boned",
    "soft, rounded",
    "hard, sculpted"
  ],
  "weight": [
    "emaciated",
    "underweight",
    "a little under",
    "just right",
    "a little over",
    "overweight",
    "obese"
  ],
  "gesture": [
    "holds still when talking",
    "gestures for dramatic effect",
    "quick, constant gestures",
    "slight, subtle gestures",
    "twitchy, won't sit still",
    "sits on or hides hands"
  ],
  "handed": [
    "left-handed",
    "right-handed",
    "ambidextrous"
  ],
  "movement": [
    "limps/uneven gait",
    "moves in a cautious/tense manner",
    "moves in a fast/controlled manner",
    "moves in a fast/jerky manner",
    "moves in a slow/clumsy manner",
    "moves in a slow/controlled manner",
    "has a long stride",
    "has a short stride",
    "walks fast with a forward lean",
    "walks fast and upright",
    "walks slow and leans back",
    "walks slow and upright"
  ],
  "stance": [
    "hunches the shoulders",
    "has a military bearing",
    "is bowlegged",
    "has a contorted/twisted posture",
    "has a relaxed stance",
    "slouches/slumps",
    "stands with hips forward",
    "has a stiff/tense stance",
    "stands with the stomach relaxed",
    "stands with the stomach tensed"
  ],
  "hairtype": [
    "coarse",
    "curly",
    "fine",
    "frizzy",
    "straight",
    "thick",
    "thin",
    "wavy",
    "wiry"
  ],
  "hairlength": [
    "shaved",
    "cropped",
    "short",
    "chin-length",
    "shoulder-length",
    "mid-back",
    "waist-length",
    "thigh-length",
    "knee-length",
    "ankle-length",
    "floor-length"
  ],
  "haircolor": [
    "light blond",
    "dark blond",
    "strawberry blond",
    "medium red",
    "auburn",
    "light brown",
    "medium brown",
    "dark brown",
    "black-brown",
    "black-blue",
    "silver",
    "gray",
    "salt-and-pepper",
    "pink",
    "bright red",
    "green",
    "light blue",
    "dark blue",
    "purple",
    "orange",
    "bleached blond",
    "multicolored",
    "colorful streaks",
    "single streak",
    "bleached streaks",
    "root/dye line"
  ],
  "eyecolor": [
    "amber",
    "dark brown",
    "light brown",
    "green",
    "light blue",
    "dark blue",
    "blue-green",
    "gray",
    "hazel-green",
    "hazel-brown",
    "hazel-blue",
    "heterochromatic",
    "milky"
  ],
  "eyedetail": [
    "angled",
    "bulging",
    "close-set",
    "deep-set",
    "single-lidded",
    "large",
    "shadowed",
    "reddened",
    "round",
    "small",
    "squinty",
    "sunken",
    "watery",
    "wide-set",
    "wrinkled",
    "bagged",
    "an eyepatch"
  ],
  "eyebrows": [
    "arched",
    "angled",
    "bushy",
    "heavy",
    "light",
    "shaved",
    "thin",
    "unibrow"
  ],
  "faceshape": [
    "diamond-shape",
    "heart-shape",
    "long",
    "oval",
    "round",
    "square"
  ],
  "forehead": [
    "broad forehead",
    "creased brow",
    "high forehead",
    "receding hairline",
    "widow's peak",
    "lined forehead",
    "smooth forehead"
  ],
  "facehair": [
    "beard",
    "goatee",
    "mustache",
    "mustache, pencil",
    "mustache, walrus",
    "mutton-chops",
    "sideburns",
    "soul patch",
    "stubble",
    "van dyke"
  ],
  "nose": [
    "broken",
    "bulbous",
    "crooked",
    "flat",
    "hawk",
    "hooked",
    "large",
    "wide",
    "narrow",
    "bent",
    "short",
    "small",
    "snub",
    "turned-up"
  ],
  "otherface": [
    "smile lines",
    "high cheekbones",
    "dimple",
    "frown lines",
    "prominent adam's apple",
    "sunken cheeks",
    "thick neck",
    "round cheeks",
    "crows feet",
    "recessed chin",
    "strong jaw",
    "jowls",
    "jutting chin",
    "double chin",
    "chin cleft"
  ],
  "lips": [
    "chapped lips",
    "cleft palate",
    "hairlip",
    "bitten lips",
    "curled-down lips",
    "curled-up lips",
    "full lips",
    "large lips",
    "puffy lips",
    "rosebud mouth",
    "stained lips",
    "thin lips",
    "firm lips"
  ],
  "teeth": [
    "white",
    "yellow",
    "stained",
    "straight",
    "overbite",
    "underbite",
    "broken",
    "crooked"
  ],
  "outlook": [
    "optimistic",
    "pessimistic",
    "cynical",
    "idealistic",
    "realistic",
    "pragmatic"
  ],
  "traits": [
    "absent-minded",
    "adventurous",
    "agreeable",
    "aggressive",
    "ambitious",
    "analytical",
    "assertive",
    "awkward",
    "boastful",
    "bold",
    "bossy",
    "brilliant",
    "brusque",
    "calm",
    "careless",
    "cautious",
    "charming",
    "cheerful",
    "clever",
    "clingy",
    "compassionate",
    "competitive",
    "conceited",
    "confident",
    "confused",
    "considerate",
    "contemptuous",
    "courageous",
    "cowardly",
    "creative",
    "cruel",
    "curious",
    "daring",
    "demanding",
    "determined",
    "diplomatic",
    "disagreeable",
    "disapproving",
    "distrustful",
    "dull",
    "energetic",
    "excitable",
    "fearful",
    "fierce",
    "forgetful",
    "forgiving",
    "frantic",
    "friendly",
    "funny",
    "generous",
    "gentle",
    "gloomy",
    "greedy",
    "happy",
    "hard-working",
    "helpful",
    "honest",
    "humble",
    "imaginative",
    "impatient",
    "impulsive",
    "independent",
    "insensitive",
    "intelligent",
    "intimidating",
    "inventive",
    "irresponsible",
    "joyful",
    "kind",
    "laidback",
    "lazy",
    "loud",
    "lovable",
    "loyal",
    "messy",
    "mischievous",
    "nagging",
    "naive",
    "obedient",
    "outspoken",
    "passionate",
    "patient",
    "pedantic",
    "playful",
    "pleasant",
    "polite",
    "prim",
    "proper",
    "proud",
    "quarrelsome",
    "quick-tempered",
    "quiet",
    "reasonable",
    "reckless",
    "reliable",
    "reserved",
    "respectful",
    "responsible",
    "restless",
    "rude",
    "sad",
    "selfish",
    "sensitive",
    "sentimental",
    "serious",
    "sharp-witted",
    "shiftless",
    "shrewd",
    "shy",
    "simple-minded",
    "sneaky",
    "soft-hearted",
    "spunky",
    "stern",
    "stingy",
    "stubborn",
    "studious",
    "superstitious",
    "suspicious",
    "sycophantic",
    "talkative",
    "thoughtful",
    "timid",
    "tireless",
    "tough",
    "trusting",
    "ungrateful",
    "unpredictable",
    "unselfish",
    "weak-willed",
    "wild",
    "wise",
    "withdrawn",
    "witty",
    "zany"
  ],
  "fight": [
    "pure pacifist",
    "defense only",
    "reluctant fighter",
    "willing fighter",
    "seeks/starts fights"
  ],
  "argue": [
    "agree to anything, even ignore own needs, to end argument",
    "loud, noisy, energetic, to drown out opposition",
    "stays calm, negotiates",
    "sulks, complains, whines, gives silent treatment",
    "lays down the law as pre-emptive strike",
    "hides/ignores/retreats to avoid argument",
    "locks down emotions, argues on logic alone"
  ],
  "quirks": [
    "Emotionless but fakes it well enough to fool everyone.",
    "Excessively optimistic despite reality.",
    "Gives attitude to everyone except to one or two specific people.",
    "Happiest when working in a crowded, noisy environment.",
    "Hard worker, but without actual goals.",
    "Has a list of transgressions and a revenge appropriate for each.",
    "Has itchy scalp, elbows, stomach, etc; constantly scratching.",
    "Has never cut hair and/or shaved.",
    "Has no body hair.",
    "Has the attention span of a goldfish.",
    "Has variety of nicknames depending on social group.",
    "Hides cash in sock, shorts, bra, etc.",
    "Hums tunelessly when thinking, or when working on something.",
    "Hypersensitive sense of smell, hearing, sight, etc.",
    "Hypochondriac; always seeking cure for a disease or condition.",
    "insists on a different name each day, depending on mood.",
    "insists on butting into every single little problem.",
    "insists on sharing equally, but privately hoards the same item (food, money, etc).",
    "insomniac; goes without sleep for several days at a time, and eventually showing the strain.",
    "Looks and acts stupid, but is a passionate master persuader.",
    "Loves to cook, but does it very badly.",
    "Loves to wear costume jewelry, tricked out clothing, etc.",
    "Makes fun of opponents by mimicking them.",
    "Masochist; enjoys pain.",
    "Messy but insists it's an organized chaos; knows where everything is, and can find it quickly.",
    "Must control everyone and everything.",
    "Names and becomes attached to inanimate or non-sentient things (ie rocks, insects, clouds).",
    "Names and talks to all personal weapons.",
    "Never answers the door.",
    "Never asks for help; always tries to do everything independently.",
    "Never curses or uses a deity's name in vain. Disapproves of those who do.",
    "Never dodges oncoming pedestrians, forcing others to move out of the way instead.",
    "Never looks anyone in the eye.",
    "Never refuses a challenge, no matter how stupid it may be.",
    "Never sheaths a weapon until it's tasted blood.",
    "Never talks about the future.",
    "Never talks about the past.",
    "Nonpicky about lovers; happy with anyone.",
    "Nudist.",
    "Receives visions from smoke or steam.",
    "Refers to self in the third person.",
    "Regularly looks up at the sky to check the position of the sun/moon.",
    "Strategist; always seems to have planned for any contingency.",
    "Submits to the ideas and suggestions of others without thinking of own needs.",
    "Suffers from short-term memory loss.",
    "Takes immediate and instinctive command of every emergency situation.",
    "Takes practical jokes very poorly.",
    "Takes stupid bets/dares for small amounts of money.",
    "Terrified of cats.",
    "Terrified of deep water.",
    "Terrified of dogs.",
    "Tone-deaf but loves to sing. Loudly.",
    "Treats everyone with respect, no matter their class or station.",
    "Unable to take advice without finding reason to insist it won't work.",
    "Very low self-esteem; suffers extreme self-doubt at the slightest criticism.",
    "When told no, it only strengthens resolve.",
    "Will accept almost anything as normal, once explained.",
    "Will deny/ignore own feelings as required, to avoid offending friends.",
    "Will deny/ignore own feelings as required, to avoid offending strangers.",
    "Willing to do anything for information.",
    "Terrified of not meeting parent, teacher, or deity expectations.",
    "Thinks up elaborate solutions then discards them for being too easily seen through.",
    "Thinks up elaborate solutions to simple problems.",
    "Oblivious to entire wardrobe being paint/ink-spattered.",
    "Obsesses over specific body parts of potential lovers.",
    "Offended upon realizing someone listened just to shut them up (and then didn't follow advice).",
    "Often busy mending broken objects, just to see if it can be done.",
    "Attached to certain items, even if owned by another, and feels slighted if items are mistreated.",
    "Organizes important paperwork in stacks.",
    "Overprotective of younger friends; suspicious of friends' lovers.",
    "Overprotective of younger siblings; suspicious of siblings' friends/lovers.",
    "Personally offended when mail is misdelivered.",
    "Picks up trash that other people drop.",
    "Profusely sweats even when at rest.",
    "Raises chickens, pigs, etc.",
    "Readily gets in the way of danger if it's required to protect a loved one.",
    "Readily gets in the way of danger if it's required to protect anyone, including strangers.",
    "Readily lands in the way of danger without thinking first.",
    "Rude to everyone.",
    "Rude, but purely unintentionally.",
    "Sadist; enjoys dispensing pain.",
    "Absent-minded, losing glasses while still wearing them.",
    "Absolutely no sense of direction.",
    "Affectionate towards farm animals.",
    "Agrees with opponent at first, and changes mind later in private.",
    "Always finds an excuse not to admit romantic feelings towards another.",
    "Always finds the bright side of any disaster, however far-fetched.",
    "Always gets others to agree first to something unwanted, to later get them to agree to actual desire.",
    "Always hugs full-body contact, regardless of relationship.",
    "Always hugs shoulders-only, regardless of relationship.",
    "Always knows the direction traveling in.",
    "Always needs to be the center of attention.",
    "Always replies to letters immediately.",
    "Always tidies up the table and resets the condiments when dining out.",
    "Always uses a handkerchief to touch items at public restaurant/inn.",
    "Asks for something over and over, even after being told it's infeasible, impossible, unavailable, etc.",
    "Turned on by any name with a certain sound in it.",
    "Avoids specific songs due to connection with non-traumatic/trivial events.",
    "Avoids specific songs due to connection with traumatic events.",
    "Can determine how any device functions just by handling it briefly.",
    "Can only hear out of one ear.",
    "Can only see out of one eye.",
    "Can perform rapid mental calculations without effort.",
    "Can play any song after only hearing once.",
    "Can recite text in full after only hearing once.",
    "Can recite text in full after only reading once.",
    "Can repair anything mechanical with only a few minutes' study.",
    "Can replicate any sound, flawlessly.",
    "Can see patterns and sequences and decrypt codes easily.",
    "Can walk through any terrain without leaving a trail.",
    "Can't swallow pills.",
    "Cannot swim, and has no inclination to learn.",
    "Carries a good luck charm everywhere.",
    "Celebrates in rambunctious manner when plans are settled.",
    "Classist; doesn't admit publicly to having 'the wrong type' of friends.",
    "Clumsy, always breaks things, trips over things, etc.",
    "Constantly rescuing stray animals.",
    "Constantly scanning the faces of all strangers who walk past.",
    "Constantly sniffling despite being healthy.",
    "Constantly spitting.",
    "Constantly tweaks what's already completed, to make it better.",
    "Constantly wants help with even the simplest tasks.",
    "Contradicts everyone about absolutely anything even the pointless things.",
    "Denies any fact that does not fit into personal theory of how things work.",
    "Depressed unless given a steady stream of positive feedback.",
    "Doesn't wash hands after using the bathroom.",
    "Dreams, meaningful; is convinced every strange dreams is a portent.",
    "Drops trash without caring where it lands.",
    "Easily brought to tears over specific topics, but tries to hide it.",
    "Easily deceived by anyone who uses big/unfamiliar words.",
    "Easily distracted by a particular type of person, will devote total attention to any of that type who appear.",
    "Easily swayed by food and money.",
    "Always wears a hat, scarf, or head-wrap.",
    "Considers a certain type of animal unclean and won't wear/use anything made from it.",
    "Unable to pass mirror or reflective surface without checking hair, makeup, appearance.",
    "Wears a piece of jewelry constantly for specifically sentimental reasons.",
    "Constantly trying to recruit people to religious/philosophical beliefs.",
    "Does not believe in a deity, and scorns those who do.",
    "Intensely passionate about beliefs, strong temper if violated in some way.",
    "Professes multiple, incompatible religions.",
    "Believes god is a sham created by the clergy to get money.",
    "Believes they're part of some kind of prophecy.",
    "Believes large gatherings are fronts for a massive conspiracy.",
    "Picks up little objects and leaves behind something else in replacement.",
    "Picks up little objects and always seems to lose something else at the same time.",
    "Collects rocks.",
    "Distrusts and suspects anyone with a strong intuition.",
    "Distrusts anyone who refuses to doubt themselves.",
    "Distrusts own memory; compensates by being a compulsive note-taker.",
    "Distrusts people who can't remember names.",
    "Distrusts people who have a specific eye-color.",
    "Distrusts people who talk with an accent.",
    "Does not own, nor want to own, a television.",
    "Accepts only specific brands of alcohol.",
    "Adores a specific drink, and gets upset when it's not available.",
    "Gives the first bite to deity/ancestors by setting it aside.",
    "Hates alcohol.",
    "Hates tea.",
    "Eats as if it's competition; learned to grab food quickly or go hungry.",
    "Often gets sick from overeating.",
    "Picky eater; willing to offend hosts/friends to avoid certain foods.",
    "Learned to eat fast due to never having enough time for a meal.",
    "Adores a specific food, and gets upset when it's not available.",
    "Chews with mouth open.",
    "Considers a certain type of animal unclean and won't eat it.",
    "Constantly sucking on a breath mint or candy.",
    "Doesn't like when different kinds of food touch on the plate.",
    "Eats and talks at the same time.",
    "Gives the first sip to deity/ancestors by spilling it onto the ground.",
    "Hates vegetables.",
    "Only uses hands.",
    "Paranoid about eating food someone else cooked.",
    "Puts a specific condiment (syrup, salt, etc) on everything.",
    "Refuses to touch food with hands.",
    "Vegetarian for personal reasons.",
    "Vegetarian for cultural reasons.",
    "Constantly tugging on a necklace, twisting it, etc.",
    "Constantly tugging on earrings, or removing and replacing.",
    "Twists a ring around the finger, repeatedly.",
    "Bites nails to the quick.",
    "Constantly chewing on non-food (toothpick, pen-cap, lollipop-stick).",
    "Constantly doodling in margins of papers, books, etc.",
    "Constantly touches face or head.",
    "Fidgety, with nervous twitches in hands, eyes, feet.",
    "Picks at own skin, hair, clothing, or teeth obsessively when tense.",
    "Restless, always has leg or hand tapping or moving.",
    "Always has pocket change to give to beggars or homeless.",
    "Always has the precise amount of money to purchase any specific thing.",
    "Generous with money even when unable to afford being so.",
    "Refuses to pay more than the barest amount required for accommodations.",
    "Thrifty almost to the point of obsession.",
    "Greets acquaintances by kissing both cheeks.",
    "Greets acquaintances by kissing one cheek.",
    "Greets acquaintances with a bow.",
    "Greets acquaintances with a handshake.",
    "Greets acquaintances with a hug.",
    "Greets acquaintances with a simple nod.",
    "Greets enthusiastically rambunctious upon meeting someone for the first time.",
    "Greets friends by kissing both cheeks.",
    "Greets friends by kissing one cheek.",
    "Greets friends with a handshake.",
    "Greets friends with a simple nod.",
    "Greets new-met friend by kissing both cheeks.",
    "Greets new-met friend by kissing one cheek.",
    "Greets new-met friend with a bow.",
    "Greets new-met friend with a hug.",
    "Greets new-met friend with a nod.",
    "Refuses to shake hands for any reason.",
    "Hates children.",
    "Hates clothes left lying around.",
    "Hates doing the same thing day after day.",
    "Hates having name mispronounced.",
    "Hates having name misspelled.",
    "Hates messy rooms; becomes furious if forced to spend time in one.",
    "Hates messy rooms; will start cleaning regardless of situation.",
    "Hates putting clothes away.",
    "Hates the sound of chewing.",
    "Hates to clean anything.",
    "Hates to cook, but is actually a very good cook.",
    "Hates to do laundry.",
    "Hates to sweat, and is turned off by people who sweat profusely.",
    "Hates to wash dishes.",
    "Violent reaction if approached from behind without warning.",
    "Violent reaction if hugged by someone not given 'permission' to do so.",
    "Violent reaction if hugged without warning.",
    "Never smiles.",
    "Treats every joke as though it were serious.",
    "Will go overboard getting people to laugh even in a serious situation.",
    "Smiles even when the situation is serious.",
    "Laughs at the wrong things.",
    "Deadpan humor to the point even friends aren't certain what's serious and what's meant in humor.",
    "Instantly knows what others feel, and is always wrong.",
    "Instantly knows what others feel.",
    "Miserable when the air is still or stuffy.",
    "Miserable when the humidity is over a certain point.",
    "Miserable when there's a strong wind.",
    "Abrupt nightmares; wakes with a terrified jolt and soaked in sweat.",
    "Dramatic nightmares, wakes with yell or specific cry.",
    "Soft nightmares: comes awake slowly, while crying.",
    "Can't wake from nightmare, except by forcing out sounds in hopes someone will help.",
    "Falls asleep when temperature drops below a certain point.",
    "Gets sluggish when temperature drops below a certain point.",
    "Requires nine or more hours of sleep a night to function well.",
    "Heavy sleeper; blasting caps won't even wake the person.",
    "Falls asleep when temperature rises above a certain point.",
    "Gets sluggish when temperature rises above a certain point.",
    "Light sleeper; wakes at the slightest crack or pop.",
    "Doesn't need more than 3-4 hours of sleep to function well.",
    "Picky sleeper; cannot sleep in a waterbed.",
    "Picky sleeper; cannot sleep on the floor, or near-floor level.",
    "Picky sleeper; only sleeps in a hammock.",
    "Picky sleeper; only sleeps well on the floor.",
    "Picky sleeper; sleeps best sitting up.",
    "Picky sleeper; won't sleep under the window.",
    "Restles sleeper; icks, tosses, turns, and flails all night long.",
    "Falls asleep and gets up at the same time every day.",
    "Refuses to cross water over a certain depth.",
    "Refuses to fight with anyone already injured.",
    "Refuses to fight with anyone smaller.",
    "Refuses to fight with the opposite gender.",
    "Refuses to hug even good friends.",
    "Refuses to respect anyone until the respect is fully earned.",
    "Refuses to see flaws in loved ones.",
    "Refuses to see positive attributes in disliked people.",
    "Refuses to stop and ask for directions. At all. Ever.",
    "Relates everything to a fable or allegory.",
    "Relates everything to books, ie, is reminded of X scene from Y book.",
    "Relates everything to specific songs, ie, is reminded of X lyric or Y album.",
    "Relaxes by being alone and playing an instrument.",
    "Relaxes by being with friends even if not interacting (in the same room while reading a book, etc).",
    "Relaxes by joining a large crowd of strangers and making friends.",
    "Relaxes by sitting out in public and people-watching."
  ],
  "strengthbelief": [
    "agnostic",
    "atheist",
    "casual",
    "cultural",
    "devout",
    "fanatical"
  ],
  "romance": [
    "celibate",
    "inexperienced",
    "monogamous",
    "polyamorous",
    "promiscuous",
    "serial-monogamous",
    "super-selective",
    "unfaithful",
    "single",
    "dating",
    "asexual",
    "graysexual"
  ],
  "intelligence": [
    "non-functional",
    "functional",
    "average",
    "bright",
    "brilliant",
    "genius"
  ],
  "knowledge": [
    "none; beginner in almost all areas",
    "limited; some knowledge in some areas",
    "average; range from novice to advanced on many top",
    "considerable; knowledge base deep in selected area",
    "comprehensive; knowledge base deep and broad",
    "limited expert, only a few areas",
    "unlimited expert, many areas"
  ],
  "relationtype": [
    "parent",
    "grandparent",
    "great-grandparent",
    "child",
    "grandchild",
    "aunt/uncle",
    "nephew/niece",
    "great-uncle/aunt",
    "great-great-uncle/aunt",
    "great-niece/nephew",
    "sibling",
    "cousin",
    "friend",
    "lover",
    "spouse",
    "partner",
    "ally",
    "adversary",
    "enemy",
    "acquaintance",
    "coworker",
    "teacher",
    "student",
    "employer",
    "employee"
  ],
  "relationquality": [
    "abusive",
    "acquainted ",
    "acrimonious",
    "affable",
    "affectionate",
    "affiliated",
    "amiable",
    "amicable",
    "argumentative",
    "arm’s-length",
    "attentive",
    "brittle",
    "broken",
    "brotherly/sisterly",
    "casual",
    "clannish",
    "close",
    "co-dependent",
    "communicative",
    "connected",
    "consistent",
    "controlling",
    "cordial",
    "cozy",
    "damaged",
    "disowned",
    "distant",
    "dysfunctional",
    "easygoing",
    "estranged",
    "faithful",
    "forgiving",
    "fragile",
    "friendly",
    "giving",
    "harmonious",
    "honest",
    "humorous",
    "illicit",
    "inseparable",
    "intimate",
    "kind",
    "lively",
    "long-lost",
    "long-standing",
    "loveless",
    "loving",
    "loyal",
    "manipulative",
    "neglected",
    "nurturing",
    "one-sided",
    "one-way",
    "platonic",
    "playful",
    "political",
    "predictable",
    "recovering",
    "reliable",
    "resentful",
    "reserved",
    "rocky",
    "shaky",
    "shifting",
    "silent",
    "simpatico",
    "sincere",
    "social",
    "solid",
    "sporadic",
    "strong",
    "stunted",
    "superficial",
    "supportive",
    "symbiotic",
    "sympathetic",
    "tightknit",
    "trustworthy",
    "turbulent",
    "uneasy",
    "unequal",
    "unimportant",
    "unpredictable",
    "unrequited",
    "unstable",
    "violent",
    "warm"
  ],
  "defense": [
    "goes on the attack",
    "finds allies, support",
    "blames someone else",
    "plans intensely against repetition",
    "attacks indirectly/passive-aggressive",
    "regresses, acts out/up",
    "retreats into fantasy world",
    "turns to belief system",
    "buries/denies feelings",
    "invents plausible but false excuse",
    "represses, get physically ill",
    "compensates with good deeds",
    "devalues, says doesn't matter",
    "deflects/turns it into a joke",
    "flaunts, claims intentional",
    "intellectualizes until distanced"
  ]
};

function containsObject(obj, list) {
    var i;
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === obj.name) {
            return true;
        }
    }
    return false;
};
