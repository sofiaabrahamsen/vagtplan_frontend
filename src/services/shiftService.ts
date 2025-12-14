
import { axiosInstance } from "./api-client";
import type { Shift } from "../entities/Shift";
export const shiftService = {
  getEmployeeShifts: async (): Promise<Shift[]> => {
    const { data } = await axiosInstance.get<Shift[]>("/Employee/get-employee-shifts");
    return data;
  },
  startShift: async (shiftId: number, startTime: string): Promise<void> => {
    await axiosInstance.put(`/Shift/${shiftId}/start`, null, {
      params: { startTime },
    });
  },
  endShift: async (shiftId: number, endTime: string): Promise<void> => {
    await axiosInstance.put(`/Shift/${shiftId}/end`, null, {
      params: { endTime },
    });
  },
};
