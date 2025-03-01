import axios from "axios";

const API_URL = "http://localhost:8080/api/artists";

export const listArtists = async () => {
    return axios.get(API_URL);
};