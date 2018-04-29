import Axios from "axios";

const redditOAuthInstance = Axios.create();
const redditNoAuthInstance = Axios.create();

redditOAuthInstance.interceptors.request.use(config => {
    config.url = "https://oauth.reddit.com/" + config.url;
    return config; 
});

redditNoAuthInstance.interceptors.request.use(config => {
    config.url = "https://www.reddit.com/" + config.url;
    return config; 
});

const redditRequests = {};

redditRequests.access_token = undefined;

redditRequests.genericGetRequest = async (url) => {
    if (!url || typeof (url) !== 'string' || url.length === 0) {
        throw 'Invalid URL to Make Get Request';
    }

    let response;
    if (redditRequests.access_token) {
        response = await redditOAuthInstance.get(url, {headers: {Authorization: 'Bearer ' + redditRequests.access_token}});
    } else {
        response = await redditNoAuthInstance.get(url, null);
    }

    if (!response.data) {
        throw 'No Data Received!';
    }

    return response.data;
}

redditRequests.genericPostRequest = async (url, body) => {
    if (!url || typeof (url) !== 'string' || url.length === 0) {
        throw 'Invalid URL to Make Get Request';
    }

    let response;
    if (redditRequests.access_token) {
        response = await redditOAuthInstance.post(url, body, {headers: {Authorization: 'Bearer ' + redditRequests.access_token}});
    } else {
        response = await redditNoAuthInstance.post(url, body, null);
    }

    if (!response.data) {
        throw 'No Data Received!';
    }

    return response.data;    
}

redditRequests.setAccessToken = (access_token) => {
    redditRequests.access_token = access_token;
}

export default redditRequests;
