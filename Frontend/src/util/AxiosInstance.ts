import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://us-central1-in-time-bf12b.cloudfunctions.net/"
});