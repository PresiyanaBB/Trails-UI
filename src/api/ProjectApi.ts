import axios, { AxiosResponse } from 'axios';

const API_URL = "http://localhost:8080/api/projects";

export const getProjects = async () => {
    return axios.get(API_URL);
};

export const getProject = async (id: string): Promise<AxiosResponse<unknown>> => {
    return axios.get(`${API_URL}/${id}`);
};

export const createProject = async (project: unknown): Promise<AxiosResponse<unknown>> => {
    return axios.post(API_URL, project);
};

export const updateProject = async (id: string, project: unknown): Promise<AxiosResponse<unknown>> => {
    return axios.put(`${API_URL}/${id}`, project);
};

export const deleteProject = async (id: string): Promise<AxiosResponse<unknown>> => {
    return axios.delete(`${API_URL}/${id}`);
};

export const findProjectByName = async (name: string): Promise<AxiosResponse<unknown>> => {
    return axios.get(`${API_URL}?name=${name}`);
};
