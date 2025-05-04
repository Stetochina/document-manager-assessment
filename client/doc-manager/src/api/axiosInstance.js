import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8001/",
  paramsSerializer: (params) => {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
