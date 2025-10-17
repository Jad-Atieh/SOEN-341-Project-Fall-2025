// import axios from "axios";
// import { ACCESS_TOKEN } from "./constants";


// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL // base url taken from the env
// });

// //to be used before every request. Follows the api.interceptors.request(SUCCESS, ERROR) format
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(ACCESS_TOKEN); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // change to your backend URL
});

// Automatically attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
