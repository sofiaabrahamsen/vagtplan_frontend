import axios, { type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env['VITE_API_URL'],
});

class ApiClient<T> {
    endpoint: string;

    constructor(endpoint: string) {
    this.endpoint = endpoint;
}

    getAll = (config?: AxiosRequestConfig) =>
    axiosInstance.get<T[]>(this.endpoint, config).then((res) => res.data);

    get = (id: number | string) =>
    axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    create = (data: Partial<T>) =>
    axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);

    update = (id: number, data: Partial<T>) =>
    axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);

    delete = (id: number) =>
    axiosInstance.delete(`${this.endpoint}/${id}`).then((res) => res.data);
}

export default ApiClient;
