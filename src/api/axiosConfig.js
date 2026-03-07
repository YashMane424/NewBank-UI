

import axios from 'axios';


const axiosApi = axios.create({
    baseURL:'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        
    },

});
let getToken = () => localStorage.getItem('token');

export const setTokenGetter = (getter) => {
    getToken = getter;
};

axiosApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error);
    }
);
axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response?.status === 401) {
            const refreshtoken = localStorage.getItem('token');
            console.log('Unauthorized! Token removed:', refreshtoken);

            const { data } = await axios.get("/api/auth/refresh", refreshtoken )

            localStorage.setItem("accessToken", data.accessToken);

            error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
            return axios(error.config);

        }
        return Promise.reject(error);
    }
);


export default axiosApi;