

import axios from 'axios';

const MAX_QUEUE_SIZE = 100; // For memory exhaustion(Out of Memory OOM)
const BATCH_SIZE = 10;       // If there are too much retries, just retry small packets
const BATCH_DELAY_MS = 50;   // Delay to avoid server overload

const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api' || 'http://localhost:8080/api',
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

let isRefreshing = false;      
let failedQueue = [];         

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processQueue = async(error, token = null) => {
    const queueToProcess = [...failedQueue];
    failedQueue = []

    for (let i = 0; i < queueToProcess.length; i += BATCH_SIZE) {
    const batch = queueToProcess.slice(i, i + BATCH_SIZE);
        
    batch.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    }); 
    if(i + BATCH_SIZE < queueToProcess.length) {
      await delay(BATCH_DELAY_MS);
    }
  }
};

axiosApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Reject incoming requests if the retry queue is full
                if (failedQueue.length >= MAX_QUEUE_SIZE) {
                  return Promise.reject(new Error('Too many pending requests during token refresh.'));
                }
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosApi(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshUrl = `${axiosApi.defaults.baseURL}/auth/refresh`;
                const { data } = await axios.post(
                    refreshUrl,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json', } }
                );

                const newToken = data.token;
                localStorage.setItem('token', newToken);

                axiosApi.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);  
                return axiosApi(originalRequest); 

            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);


export default axiosApi;
