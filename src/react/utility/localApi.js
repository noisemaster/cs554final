import Axios from "axios";

const localInstance = Axios.create();

localInstance.interceptors.request.use(config => {
    config.url = window.location + config.url;
    console.log(config.url);
    return config; 
});

const localRequests = {};

localRequests.configure = async () => {
    const request = await localInstance.get('configure');
    return request.data;
}

localRequests.getUrl = async() => {
    const request = await localInstance.get('reddit/url');
    return request.data;
}

export default localRequests;
