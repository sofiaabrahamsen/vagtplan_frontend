import ApiClient from "./api-client";
import type { MonthlyHoursRow } from "../entities/WorkHours";

export const workHoursService = new ApiClient<MonthlyHoursRow>("/reports/monthly-hours");
export type { MonthlyHoursRow };
