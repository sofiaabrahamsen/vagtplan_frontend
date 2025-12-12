// src/services/employeeService.ts
import ApiClient, { axiosInstance } from "./api-client";
import type { Employee } from "../entities/Employee";
import type { Route } from "./routeService";

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
}

class EmployeeService extends ApiClient<Employee> {
  constructor() {
    super("Employees"); // base path => /Employees (via ApiClient)
  }

  // ---------------------------------------
  // GET employee by ID (used by dashboard)
  // ---------------------------------------
  async getById(id: number): Promise<Employee> {
    const {data} = await axiosInstance.get<Employee>(`/Employees/${id}`);
    return data;
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

  createEmployee(payload: EmployeePayload) {
    return this.create(payload); // POST /Employees
  }

  updateEmployee(id: number, payload: EmployeePayload) {
    return this.update(id, payload); // PUT /Employees/:id
  }

  deleteEmployee(id: number) {
    return this.delete(id); // DELETE /Employees/:id
  }
}

export const employeeService = new EmployeeService();
export type { Employee };
