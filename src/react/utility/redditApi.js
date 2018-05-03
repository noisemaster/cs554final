import Axios from "axios";
import localApi from './localApi';

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
    try {
        if (!url || typeof (url) !== 'string' || url.length === 0) {
            throw new Error('Invalid URL to Make Get Request');
        }
    
        let response;
        if (redditRequests.access_token) {
            response = await redditOAuthInstance.get(url, {headers: {Authorization: 'Bearer ' + redditRequests.access_token}});
        } else {
            response = await redditNoAuthInstance.get(url, null);
        }
    
        if (!response.data) {
            throw new Error('No Data Received!');
        }
    
        return response.data;
    } catch (e) {
        if (e.response && e.response.status && e.response.status === 401) {
            await localApi.refresh();
        }
        throw e;
    }

}

redditRequests.genericPostRequest = async (url, body) => {
    try {
        if (!url || typeof (url) !== 'string' || url.length === 0) {
            throw new Error('Invalid URL to Make Get Request');
        }
    
        let response;
        if (redditRequests.access_token) {
            response = await redditOAuthInstance.post(url, body, {headers: {Authorization: 'Bearer ' + redditRequests.access_token}});
        } else {
            response = await redditNoAuthInstance.post(url, body, null);
        }
    
        if (!response.data) {
            throw new Error('No Data Received!');
        }
    
        return response.data; 
    } catch (e) {
        if (e.response && e.response.status && e.response.status === 401) {
            await localApi.refresh();
        }
        throw e;
    }   
}

redditRequests.setAccessToken = (access_token) => {
    redditRequests.access_token = access_token;
}

export default redditRequests;
