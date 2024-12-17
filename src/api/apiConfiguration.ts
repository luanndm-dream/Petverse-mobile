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
  // maxContentLength: 3097152, 
  // maxBodyLength: 3097152,
  timeout: TIME_OUT,
});

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: TIME_OUT,
});

// Interceptor for axiosInstance
axiosInstance.interceptors.response.use(
  function (response) {
      
    const responseObj = {
        ...response.data,
        statusCode: response.status,
    };
    // console.log('response api', responseObj)
    return responseObj;
},
  (error) => {
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.message || error.message;
    const errorFields = Object.keys(fieldErrors).map(field => ({
      field,
      message: fieldErrors[field].join(", ")
    }));

    console.log(`Instance API Error: ${message} + ${error}`,);
    return { api: "instance", error: message, };
  }
);

// Interceptor for publicAxios
publicAxios.interceptors.request.use(
  (config) => config,
  (error) => {
    console.log("Public API Request Error:", error.message);
    return error;
  }
);

publicAxios.interceptors.response.use(
  function (response) {
      
    const responseObj = {
        ...response.data,
        statusCode: response.status,
    };
    // console.log('response api', responseObj)
    return responseObj;
},
(error) => {
    
  const fieldErrors = error.response?.data?.errors || {};
  const message = error.response?.data?.message || error.message;
  const errorFields = Object.keys(fieldErrors).map(field => ({
    field,
    message: fieldErrors[field].join(", ")
  }));

  console.log(`Public API Error: ${message} + ${error}` );
  return { api: "public", message };
}
);

// Interceptor for protectedAxios
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
  function (response) {
      
    const responseObj = {
        ...response.data,
        statusCode: response.status,
    };
    // console.log('response api', responseObj)
    return responseObj;
},
  (error) => {
    
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.message || error.message;
    const errorFields = Object.keys(fieldErrors).map(field => ({
      field,
      message: fieldErrors[field].join(", ")
    }));

    console.log(`Protected API Error: ${message} + ${error}` );
    return { api: "protected", message };
  }
);