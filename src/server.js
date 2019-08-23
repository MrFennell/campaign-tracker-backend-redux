const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('./passport');
const models = require('../models');
require('dotenv').config()

const app = express();


app.locals.models = models;

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Setup sessions
app.use(cookieParser());
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var sessionStore = new SequelizeStore({
    db: models.sequelize
});
sessionStore.sync();
app.set('trust proxy', 1);
app.use(session({
    secret: 'Shhhhh!',
    store: sessionStore,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        domain:'.webfennell.com',
        maxAge: 5184000000,
        secure: false
    },
    resave: true
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://campaigntracker.webfennell.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin,Origin,X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.session && req.session.campaign_id) {
        models.Campaign.findByPk(req.session.campaign_id)
            .then(function(campaign) {
                req.campaign = campaign;
                next();
            })
    } else if(req.session) {
        req.campaign = null;
        next();
    }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes'));

app.get('/', function(req, res){
    res.render('index');
});

module.exports = app;