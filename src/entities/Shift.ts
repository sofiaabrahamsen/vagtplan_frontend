export interface Shift {
  shiftId: number;
  dateOfShift: string;
  substitutedId: number | null;
  startTime?: string | null; //HH:mm:ss
  endTime?: string | null; //HH:mm:ss
  routeId: number;
  employeeId: number;
  bicycleId: number;
  totalHours?: number | null; //decimal
}
