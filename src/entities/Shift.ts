export interface Shift {
  shiftId: number;
  dateOfShift: string;
  startTime?: string | null;
  endTime?: string | null;
  substitutedId: number;
  routeId: number;
  totalHours?: number | null;
}
