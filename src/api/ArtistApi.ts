import axios, { AxiosResponse } from 'axios';

const API_URL = "http://localhost:8080/api/artists";

export const getArtists = async () => {
    return axios.get(API_URL);
};

export const getArtist = async (id: string): Promise<AxiosResponse<unknown>> => {
    return axios.get(`${API_URL}/${id}`);
};

export const createArtist = async (artist: unknown): Promise<AxiosResponse<unknown>> => {
    return axios.post(API_URL, artist);
};

export const updateArtist = async (id: string, artist: unknown): Promise<AxiosResponse<unknown>> => {
    return axios.put(`${API_URL}/${id}`, artist);
};

export const deleteArtist = async (id: string): Promise<AxiosResponse<unknown>> => {
    return axios.delete(`${API_URL}/${id}`);
};

export const findArtistByName = async (name: string): Promise<AxiosResponse<unknown>> => {
    return axios.get(`${API_URL}/name/${name}`);
};
