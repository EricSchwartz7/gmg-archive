import axios from 'axios';
import {API_ROOT} from './APIRoot';

const instance = axios.create({
    baseURL: API_ROOT
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