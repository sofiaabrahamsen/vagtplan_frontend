// src/services/bicycleService.ts
import ApiClient from "./api-client";
import type { Bicycle } from "../entities/Bicycle";

// BicycleNumber is a number in DB, so use number here too
export interface BicyclePayload {
  bicycleNumber: number;
  inOperate: boolean;
}

class BicycleService extends ApiClient<Bicycle> {
  constructor() {
    // base path → /api/Bicycles
    super("Bicycles");
  }

  getAllBicycles() {
    return this.getAll();
  }

  createBicycle(payload: BicyclePayload) {
    return this.create(payload);
  }

  updateBicycle(id: number, payload: BicyclePayload) {
    return this.update(id, payload);
  }

  deleteBicycle(id: number) {
    return this.delete(id);
  }
}

export const bicycleService = new BicycleService();
export type { Bicycle };
