require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const app = express();

var auth = require('./middleware/authMiddleware');
let { usersOnly, adminsOnly } = auth;

let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

massive(CONNECTION_STRING)
.then(
    db => {
        app.set('db', db);
        console.log('Connected to database successfully');
    }
)
.catch( err => console.log(err) )

app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.listen(SERVER_PORT, () => console.log('Party on, Wayne!'));

var authCtrl = require('./controller/authController');
let { register, login, logout } = authCtrl;

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/auth/logout', logout);

var treasureCtrl = require('./controller/treasureController');
let { dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure } =  treasureCtrl;

app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', usersOnly, getUserTreasure);
app.post('/api/treasure/user', usersOnly, addUserTreasure);