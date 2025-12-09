import ApiClient, { axiosInstance } from "./api-client";
import type { Employee } from "../entities/Employee";

export type User = {
  userId: number;
  username: string;
  role: string;
  employeeId?: number;
  employee?: Employee | null;
};

class EmployeeService extends ApiClient<Employee> {
  constructor() {
    super("Employees");
  }
}

export const employeeService = new EmployeeService();
export type { Employee };
