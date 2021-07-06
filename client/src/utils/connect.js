import axios from "axios";

export const FetchData = async(endpoint, { body, ...customConfig } = {}) => {
    const token = localStorage.getItem("accesstoken");
    const headers = { "Content-Type": "application/json" };


    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? "POST" : "GET",
        url: `${process.env.REACT_APP_BE}/api/v1${endpoint}`,
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.data = JSON.stringify(body);
    }

    //console.log(config);
    const { data } = await axios(config);
    
    if (data.logout) {
        localStorage.clear();
        window.location.reload();
        return Promise.reject(data);
    }
    else if (data.error) {
        return Promise.reject(data);
    }
    else {
        return data;
    }

}