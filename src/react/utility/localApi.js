import Axios from "axios";

const localInstance = Axios.create();

localInstance.interceptors.request.use(config => {
    config.url = window.location.origin + config.url;
    return config; 
});

const localRequests = {};

localRequests.configure = async () => {
    const request = await localInstance.get('/configure');
    return request.data;
}

localRequests.refresh = async () => {
    await localInstance.get('/refreshToken');
}

localRequests.getUrl = async() => {
    const request = await localInstance.get('/reddit/url');
    return request.data;
}

localRequests.setEmail = async (email) => {
    const request = await localInstance.post('/register/email', {email});
    return request.data;
}

localRequests.setColorChoice = async (color_choice) => {
    const request = await localInstance.post('/register/color', {color_choice});
    return request.data;
}

export default localRequests;
