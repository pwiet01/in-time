import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://europe-west1-in-time-bf12b.cloudfunctions.net/"
});