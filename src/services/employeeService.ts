import { axiosInstance } from "./api-client";
import type { Route } from "../entities/Route";

export interface UserInfoDto {
  userId: number;
  username: string;
  role: string;
  employeeId?: number | null;
  employee?: {
    employeeId: number;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    experienceLevel: number;
  } | null;
}

export const employeeService = {
  getUserInfo: async (): Promise<UserInfoDto> => {
    const { data } = await axiosInstance.get<UserInfoDto>("/Employee/get-user-info");
    return data;
  },

  getEmployeeRoutesById: async (employeeId: number): Promise<Route[]> => {
    const { data } = await axiosInstance.get<Route[]>(
      `/Employee/get-employee-routes-by-id/${employeeId}`
    );
    return data;
  },
};
