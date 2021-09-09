const Axios         = require('axios');

Axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

Axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return error;
});

module.exports = Axios;