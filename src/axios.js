import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://gmg-archive-api.herokuapp.com/api/v1/'
});

let getAuthToken = (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
};

instance.interceptors.request.use(
    config => getAuthToken(config),
    error => {
        Promise.reject(error)
    });

axios.interceptors.request.use(
    config => getAuthToken(config),
    error => {
        Promise.reject(error)
    });


export default instance;