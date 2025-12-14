import ApiClient from "./api-client";
import type { Shift } from "../entities/Shift";

const shiftClient = new ApiClient<Shift>("/Shift"); // change to "/Shifts" if your backend uses plural

export const adminShiftService = {
    getAllShifts: () => shiftClient.getAll(),
    createShift: (payload: Partial<Shift>) => shiftClient.create(payload),
    updateShift: (id: number, payload: Partial<Shift>) => shiftClient.update(id, payload),
    deleteShift: (id: number) => shiftClient.delete(id),
};
