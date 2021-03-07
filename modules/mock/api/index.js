import axios from 'axios';
import CONFIG from "web.config";

const request = axios.create({
    baseURL: `${ CONFIG.NEXT_PUBLIC_API_BASE_PATH }/api/v1/admin`,
    timeout: 5000
});

request.interceptors.request.use(config => {
    config.headers['X-localization'] = 'vi';
    // we're gonna setup Authorization later. Still not find out he solution to get token from user :(((  
    return config;
}, error => {
     // do something with request error
     console.log(error) // for debug
     return Promise.reject(error);
});

request.interceptors.response.use(response => {
    return response.data;
}, error => {
    console.log(error);  // for debug

    return error.response.data;
});

export default request;


export const getDefaultHeaders = (token) => {
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const clearObject = (obj, extra = false) => {
    for (var propName in obj) { 

        // remove object empty
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }

        // remove empty array
        if(Array.isArray(obj[propName]) && !!!obj[propName].length){
            delete obj[propName];
        }

        if(extra && propName === 'active') { // convert boolean to integer
            obj[propName] === true ? obj[propName] = 1 : 0;
        }
    }

    return obj;
}

export const getStringQuery = (obj) => {

    if (!obj) return '';
    const items =  [];
    for(const key in obj) {
        if(obj[key] === undefined) return;
        if(Array.isArray(obj[key])) {
            const length = obj[key].length - 1;
            for (let i = 0; i <= length; i++) {
                items.push(encodeURIComponent(`${key}[${i}]`) + '=' + encodeURIComponent(obj[key][i]));
            }
        } else {
            items.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }

    return cleanArray(items).join('&');
}

export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}