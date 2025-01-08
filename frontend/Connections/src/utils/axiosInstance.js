// import axios from "axios";
// import { BASE_URL } from "./constants"

// const axiosInstance = axios.create({
//     baseURL:"https://localhost:8000",
//     timeoit:10000,
//     headers: {
//         "Content-Type": "applications/json",
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config)=>{
//         const accessToken=localStorage.getItem("token");
        
//         if (accessToken){
//             config.headers.Authorization = 'Bearer ${accessToken}';
//         }
//         return config;
//     },
//     (error)=>{
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Make sure your backend is running on this URL
    timeout: 1000000000,
    headers: {
        "Content-Type": "application/json", // Corrected "applications/json" to "application/json"
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        console.log("Token being sent:", accessToken); // Log the token




        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Corrected here
            console.log(config.headers.Authorization);

        }
        console.log("Final request headers:", config.headers); // Log the headers

        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
