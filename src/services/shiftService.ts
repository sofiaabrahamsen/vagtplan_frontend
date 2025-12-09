import ApiClient from "./api-client";
import type { Shift } from "../entities/Shift";

export const shiftService = new ApiClient<Shift>("/shifts");
export type { Shift };
