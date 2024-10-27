import store from "@/redux/store";
import axios from "axios";
import { BASE_URL } from "src/constants/baseUrl";

const TIME_OUT = 60000;

export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIME_OUT,
});

export const protectedAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIME_OUT,
});

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: TIME_OUT,
});

axiosInstance.interceptors.response.use(
  (response) => ({
    ...response,
    statusCode: response.status,
  }),
  (error) => {
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.title || error.message;
    console.log(`Instance API Error: ${message}`, fieldErrors);
    return { api: "instance", error: message, fieldErrors };
  }
);

publicAxios.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log("Public API Request Error:", error.message);
    return error;
  }
);

publicAxios.interceptors.response.use(
  (response) => ({
    ...response.data,
    statusCode: response.status,
  }),
  (error) => {
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.title || error.message;
    console.log(`Public API Error: ${message}`, fieldErrors);
    return { api: "public", error: message, fieldErrors };
  }
);

protectedAxios.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log("Protected API Request Error:", error.message);
    return error;
  }
);

protectedAxios.interceptors.response.use(
  (response) => ({
    ...response.data,
    statusCode: response.status,
  }),
  (error) => {
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.title || error.message;
    console.log(`Protected API Error: ${message}`, fieldErrors);
    return { api: "protected", error: message, fieldErrors };
  }
);