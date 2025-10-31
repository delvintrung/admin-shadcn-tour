import axios from "axios";


const BaseAPIURL =
    import.meta.env.BASE_API_URL || "http://localhost:8080/api/v1";

export const AxiosAdmin = axios.create({
    baseURL: BaseAPIURL,
    withCredentials: true,
});

AxiosAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});