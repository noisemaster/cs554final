/* ==========================================================================================*/
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

const requests = require('./requests');
const database = require('./database');

const BASE_URI = 'http://localhost:';
const PORT = '3001';
const REACT_PORT = '3000';
const REDIRECT_PATH = '/reddit/api/authorization';

let client_id;
let client_secret;
/* ==========================================================================================*/

/* ==========================================================================================*/
const data = fs.readFileSync(path.join(__dirname, '../../data/redditApi.json'));

if (!data) {
    console.error('No Reddit API Keys Found');
    exit(1);
}

const jsonData = JSON.parse(data);
if (!jsonData.client_id || !jsonData.client_secret) {
    console.error('Invalid Reddit API Keys Found');
    exit(1);
}

client_id = jsonData.client_id;
client_secret = jsonData.client_secret;
/* ==========================================================================================*/

/* ==========================================================================================*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get(REDIRECT_PATH, async (req, res) => {
    try {
        if (!req.query.code) {
            console.log("I failed I need to handle this 1.");
        }
        const response = await requests.getAccessToken(client_id, client_secret, req.query.code, BASE_URI + PORT + REDIRECT_PATH);
        if (!response.access_token || !response.token_type
            || !response.expires_in || !response.refresh_token
            || !response.scope) {
                console.log("I failed I need to handle this 2.");
        }
        const me = await requests.getMe(response.access_token);
        if (!me || !me.name) {
            console.log("I failed I need to handle this 3");
        }
        let userObject;
        if (!(userObject = await database.getUserByName(me.name))) {
            userObject = {};
            userObject.name = me.name;
            userObject.access_token = response.access_token;
            userObject.refresh_token = response.refresh_token;
            userObject.scope = response.scope;
            userObject.id = uuid.v4();
            await database.insertUserIntoDatabase(userObject);
        }
        console.log(userObject);
        res.cookie('cs554RedditReader', userObject.id, {maxAge: 2147483647});
        res.redirect(BASE_URI+REACT_PORT);
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'Failed to Authorize Account'});
    }
});

app.get('/configure', async (req, res) => {
    console.log(req.cookies);
    if (!req.cookies || !req.cookies.cs554RedditReader) {
        res.json({});
        return;
    }
    const user = await database.getUserByUUID(req.cookies.cs554RedditReader);
    console.log(user);
    if (!user) {
        res.json({});
        return;
    }
    res.json(user);
});

app.get('/reddit/url', async (req, res) => {
    res.json({
        url: 'https://www.reddit.com/api/v1/authorize?' +
        'client_id=' + client_id +
        '&response_type=code' +
        '&state=' + uuid.v4() +
        '&redirect_uri=' + BASE_URI + PORT + REDIRECT_PATH +
        '&duration=permanent' + 
        '&scope=identity'
    });
});

app.use('*', (req, res) => {
    res.sendStatus(404);
});

app.listen(3001, () => {
    console.log('Express Server Running at http://localhost:3000');
});
/* ==========================================================================================*/
