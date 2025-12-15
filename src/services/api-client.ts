import axios, { type AxiosRequestConfig } from "axios";

// Create axios instance with environment API URL
const axiosInstance = axios.create({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
  baseURL: import.meta.env["VITE_API_URL"],
  withCredentials: true
});

// Generic API Client
class ApiClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // GET /endpoint
  getAll = (config?: AxiosRequestConfig) =>
    axiosInstance.get<T[]>(this.endpoint, config).then((res) => res.data);

  // GET /endpoint/:id
  get = (id: number | string) =>
    axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

  // POST /endpoint
  create = (data: Partial<T>) =>
    axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);

  // PUT /endpoint/:id
  update = (id: number, data: Partial<T>) =>
    axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);

  // DELETE /endpoint/:id
  delete = (id: number) =>
    axiosInstance.delete<T>(`${this.endpoint}/${id}`).then((res) => res.data);
}

export default ApiClient;
export { axiosInstance };
