// src/services/employeeService.ts
import axios from "axios";
import type { Employee } from "../entities/Employee";
import ApiClient, { axiosInstance } from "./api-client";
import type { Route } from "./routeService";

// eslint-disable-next-line @typescript-eslint/dot-notation
const VITE_AUTH_API_URL:string = import.meta.env["VITE_AUTH_API_URL"] as string;

export interface User {
  userId: number;
  username: string;
  role: string;
  employeeId?: number;
  employee?: Employee | null;
}

// Payload used by create / update endpoints
export interface EmployeePayload {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  username: string;
  experienceLevel: number;
}

class EmployeeService extends ApiClient<Employee> {
  constructor() {
    super("Employees"); // base path => /Employees (via ApiClient)
  }

  // ---------------------------------------
  // GET employee by ID (used by dashboard)
  // ---------------------------------------
    async getById(id: number): Promise<Employee> {
    const response = await axiosInstance.get(`/Employees/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  }

  // ---------------------------------------
  // GET employee routes by employeeId
  // ---------------------------------------
  async getRoutesByEmployeeId(employeeId: number) {
    const {data} = await axiosInstance.get<Route[]>(
      `/Employee/get-employee-routes-by-id/${employeeId}`
    );
    return data;
  }

  // ---------------------------------------
  // ADMIN helpers using generic ApiClient methods
  // ---------------------------------------
  getAllEmployees() {
    return this.getAll(); // GET /Employees
  }

  async createEmployee(payload: EmployeePayload): Promise<Employee> {
    const response = await axios.post(VITE_AUTH_API_URL, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      username: payload.username,
      experienceLevel: payload.experienceLevel
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data; 
  }; // POST /Employees

  updateEmployee(id: number, payload: EmployeePayload) {
    return this.update(id, payload); // PUT /Employees/:id
  }

  deleteEmployee(id: number) {
    return this.delete(id); // DELETE /Employees/:id
  }
}

export const employeeService = new EmployeeService();
export type { Employee };

