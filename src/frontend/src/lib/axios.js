import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5006/predict",
    withCredentials: true,
})

export default axiosInstance;