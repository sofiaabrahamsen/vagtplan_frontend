import ApiClient from "./api-client";
import type { Employee } from "../entities/Employee";

export interface AdminEmployeeCreatePayload {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  experienceLevel: number;
  username: string;
  password: string;
}

export interface AdminEmployeeUpdatePayload {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

// GET returns Employee[]
const employeeReadClient = new ApiClient<Employee>("/Employees");

// POST expects create payload
const employeeCreateClient = new ApiClient<AdminEmployeeCreatePayload>("/Employees");

// PUT expects update payload
const employeeUpdateClient = new ApiClient<AdminEmployeeUpdatePayload>("/Employees");

export const adminEmployeeService = {
  getAllEmployees: () => employeeReadClient.getAll(),

  createEmployee: (payload: AdminEmployeeCreatePayload) =>
    employeeCreateClient.create(payload),

  updateEmployee: (id: number, payload: AdminEmployeeUpdatePayload) =>
    employeeUpdateClient.update(id, payload),

  deleteEmployee: (id: number) => employeeReadClient.delete(id),
};
