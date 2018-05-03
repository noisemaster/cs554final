const Axios = require('axios');

const requests = module.exports;


requests.getAccessToken = async (client_id, client_secret, code, redirect_uri) => {
    const authorization = await Axios.post('https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code='
        + code
        + '&redirect_uri=' + redirect_uri,
    null,
    {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'User-Agent': 'express node.js'
        }
    });
    return authorization.data;
};

requests.refreshAccessToken = async (client_id, client_secret, refresh_token, redirect_uri) => {
    const authorization = await Axios.post('https://www.reddit.com/api/v1/access_token?grant_type=refresh_token&refresh_token='
        + refresh_token,
    null,
    {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'User-Agent': 'express node.js'
        }
    });
    return authorization.data;
};

requests.getMe = async (access_token) => {
    const me = await Axios.get('https://oauth.reddit.com/api/v1/me', {headers: {Authorization: 'Bearer ' + access_token}});
    return me.data;
};