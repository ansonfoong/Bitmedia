require('dotenv').config();
require('./strategies/authentication')
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const SessionStore = require('express-session-sequelize')(session.Store);
const database = require('./database/database');
const PORT = process.env.PORT || 3506;
const morgan = require('morgan');
const ENVIRONMENT = process.env.ENVIRONMENT;
const path = require('path');

if(ENVIRONMENT === 'DEV')
  app.use(morgan('tiny'));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'some string',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    },
    store: new SessionStore({ db: database })
}));

app.use(passport.initialize());
app.use(passport.session());

require('./utils/RouteHandler').register(app);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use((req, res) => res.redirect('/dashboard'));

const server = app.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}.`));
