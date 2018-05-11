const redisConnection = require('./redis-connection');
const requests = require('./requests');
const database = require('../../database/index')();
const users = require('../../database/users');
const fs = require('fs');
const path = require('path');

const BASE_URI = 'http://localhost:';
const PORT = '3001';
const REACT_PORT = '3000';
const REDIRECT_PATH = '/reddit/api/authorization';

const NUMBER_POSTS = 5;

let client_id;
let client_secret;

async function init()
{
    const data = fs.readFileSync(path.join(__dirname, '../../../data/redditApi.json'));

    if (!data) {
        console.error('No Reddit API Keys Found');
        process.exit(1);
    }

    const jsonData = JSON.parse(data);
    if (!jsonData.client_id || !jsonData.client_secret) {
        console.error('Invalid Reddit API Keys Found');
        process.exit(1);
    }

    client_id = jsonData.client_id;
    client_secret = jsonData.client_secret;

    redisConnection.on('generateContent:request:*', async (message,channel) => {

        if (!message || !message.requestID) {
            console.log('Bad Request: Incapable of Sending a Response');
        }
        
        try
        {
            if (!message.data)
            {
                redisConnection.emit('generateContent:response:' + message.requestID, {error: 'No user to generate content for.'});
                return;           
            }

            let userInfo = message.data.user;

            const tokenInfo = await requests.refreshAccessToken(client_id, client_secret, userInfo.refresh_token, BASE_URI + PORT + REDIRECT_PATH);

            //Update user token
            const user = {};
            user.id = userInfo.id;
            user.access_token = tokenInfo.access_token;
			user.scope = tokenInfo.scope;
			const dbPool = await users.getDatabasePool();
            await database.updateUser(dbPool, users.TABLE_NAME, user);
            
            const redditResponse = await requests.genericGetRequest('/hot/.json?raw_json=1', tokenInfo.access_token);

            let content = userInfo.username + ", here are some posts you might have missed!</br>";
            content += "<ul>"

            const frontPage = redditResponse.data.children;

            for(let i = 0; i < NUMBER_POSTS; i++)
            {
                content += "<li>" + frontPage[i].data.title; //Post name

                let postUrl = 'https://www.reddit.com' + frontPage[i].data.permalink;
                content += "<ul><li><a href=\"" + postUrl  + "\">" + postUrl + "</a></ul></li>"; //url

                content += "</li>";
            }

            content += "</ul>"

            redisConnection.emit('generateContent:response:' + message.requestID, {data: content});
        }
        catch (e)
        {
            redisConnection.emit('generateContent:response:' + message.requestID, {error: 'Unable to generate content: ' + e});
        }
    });
}


init();