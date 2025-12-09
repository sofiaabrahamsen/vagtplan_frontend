// entities/WorkHours.ts
export interface MonthlyHoursRow {
  employeeId: number;
  firstName: string;
  lastName: string;
  year: number;
  month: number;
  totalMonthlyHours: number;
  hasSubstituted: boolean;
}
