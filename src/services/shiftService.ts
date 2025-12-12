// src/services/shiftService.ts
import ApiClient from "./api-client";
import type { Shift } from "../entities/Shift";

class ShiftService extends ApiClient<Shift> {
  constructor() {
    // maps to /api/Shift because of [Route("api/[controller]")]
    super("Shift");
  }

  // GET /api/Shift
  getAllShifts() {
    return this.getAll();
  }

  // POST /api/Shift
  createShift(data: Partial<Shift>) {
    return this.create(data);
  }

  // PUT /api/Shift/{id}
  updateShift(id: number, data: Partial<Shift>) {
    return this.update(id, data);
  }

  // DELETE /api/Shift/{id}
  deleteShift(id: number) {
    return this.delete(id);
  }
}

export const shiftService = new ShiftService();
export type { Shift };
