import axios from "axios";

export const FormateDate = (date,short) => {
    const getMonth = (num) => {
        switch (num) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
            default:
                return "";
        }
    }
    let string = "";
    const d = new Date(date);
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds > 2 * 3600 * 24) {
        if(!short){
            string = getMonth(d.getMonth())+" "+d.getDate()+","+(d.getYear()+1900);
            return string;
        }
        else if(seconds<7*3600*24){
            return Math.floor(seconds/(3600*24))+"d";
        }
        else if(seconds<52*7*3600*24){
            return Math.floor(seconds/(7*3600*24))+"w";
        }
        else{
            return Math.floor(seconds/(52*7*3600*24))+"y";
        }
    }
    else{
        if(seconds<5){
            return short?"1s":"just now";
        }
        else if(seconds<59){
            string = short?seconds+"s":seconds+" sec ago";
            return string;
        }
        else if(seconds<3600){
            return Math.floor(seconds/60) + (short?"m":" min ago");
        }
        else if(seconds<3600*24){
            return Math.floor(seconds/3600)+(short?"h":" hour ago");
        }
        else{
            return Math.floor(seconds/(3600*24))+(short?"d":" day ago");
        }
    }

}
export const FetchData = async (endpoint, { body, ...customConfig } = {}) => {
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
    return axios(config).then((e) => {

        const { data } = e;
        console.log(data);
        if (data.logout) {
            localStorage.clear();
            window.location.reload();
            return data;
        }
        else if (data.refreshPage) {
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return null;
        }
        else {
            return data;
        }
    });

}

export const uploadImage = async (file) => {

    const fdata = new FormData();
    console.log("size--->", file.size, "bytes");
    fdata.append("file", file);
    fdata.append("upload_preset", "complaintlodgeriitrchat");//may be profile image
    
    console.log(process.env)
    const config = {
        onUploadProgress: (p) => {
            const progress = p.loaded / p.total;
            // if (toastIdav === null) {
            //     toastIdav = toast("Uploading...", {
            //         progress,
            //     });
            // } else {
            //     toast.update(toastIdav, {
            //         progress,
            //     });
            // }
            console.log("percentage upload-->", progress * 100);
        },
    };

    const { data } = await axios.post(//
        `https://api.cloudinary.com/v1_1/dv9k3us3f/image/upload`,
        fdata,
        config
    );

    //toast.dismiss(toastIdav);
    console.log(data);
    return data.secure_url;
}