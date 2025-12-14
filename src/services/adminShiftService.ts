import { axiosInstance } from "./api-client";
import type { Shift } from "../entities/Shift";

export interface AdminShiftPayload {
  dateOfShift: string; // "YYYY-MM-DDT00:00:00"
  employeeId: number;
  bicycleId: number;
  routeId: number;
  substitutedId: number;
}

export type AdminShiftCreatePayload = AdminShiftPayload;
export type AdminShiftUpdatePayload = AdminShiftPayload;

const base = "/Shift";

export const adminShiftService = {
  getAllShifts: async (): Promise<Shift[]> => {
    const { data } = await axiosInstance.get<Shift[]>(base);
    return data;
  },

  createShift: async (payload: AdminShiftCreatePayload): Promise<void> => {
    await axiosInstance.post(base, payload);
  },

  updateShift: async (id: number, payload: AdminShiftUpdatePayload): Promise<void> => {
    await axiosInstance.put(`${base}/${id}`, payload);
  },

  deleteShift: async (id: number): Promise<boolean> => {
    const { data } = await axiosInstance.delete<boolean>(`${base}/${id}`);
    return data;
  },
};
