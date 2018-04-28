import Axios from "axios";

const redditInstance = Axios.create();

redditInstance.interceptors.request.use(config => {
    config.url = "https://www.reddit.com/" + config.url;
    console.log(config.url);
    return config; 
});

const redditRequests = {};

