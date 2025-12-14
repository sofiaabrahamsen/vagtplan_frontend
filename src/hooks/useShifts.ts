import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { Shift } from "../entities/Shift";
import { shiftService } from "../services/shiftService";
export type ClockMode = "in" | "out" | "unavailable";
const shiftsKey = ["employeeShifts"] as const;

// ---- Helpers ----
const pad2 = (n: number) => String(n).padStart(2, "0");
const nowAsTimeSpanString = (): string => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};
const safeDate = (iso: string): Date | null => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};
const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
export const useShifts = () => {
  const queryClient = useQueryClient();
  const shiftsQuery = useQuery<Shift[], Error>({
    queryKey: shiftsKey,
    queryFn: () => shiftService.getEmployeeShifts(),
  });
  // Type generics directly on useMutation
  const startMutation = useMutation<void, Error, number>({
    mutationFn: (shiftId: number) =>
      shiftService.startShift(shiftId, nowAsTimeSpanString()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftsKey });
    },
  });
  const endMutation = useMutation<void, Error, number>({
    mutationFn: (shiftId: number) =>
      shiftService.endShift(shiftId, nowAsTimeSpanString()),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: shiftsKey });
    },
  });
  const shifts: Shift[] = shiftsQuery.data ?? [];
  // !! Force booleans to satisfy eslint no-unsafe-assignment
  const loading =
    !!shiftsQuery.isLoading || !!startMutation.isLoading || !!endMutation.isLoading;
  const error: string | null =
    shiftsQuery.error?.message ??
    startMutation.error?.message ??
    endMutation.error?.message ??
    null;
  const todayShifts = useMemo(() => {
    const today = new Date();
    return shifts.filter((s) => {
      const d = safeDate(s.dateOfShift);
      return d ? isSameDay(d, today) : false;
    });
  }, [shifts]);
  const inProgressToday = useMemo(
    () => todayShifts.find((s) => !!s.startTime && !s.endTime) ?? null,
    [todayShifts]
  );
  const startableToday = useMemo(
    () => todayShifts.find((s) => !s.startTime) ?? null,
    [todayShifts]
  );
  const clockMode: ClockMode = useMemo(() => {
    if (inProgressToday) return "out";
    if (startableToday) return "in";
    return "unavailable";
  }, [inProgressToday, startableToday]);
  const startShift = useCallback(
    async (shiftId: number) => {
      await startMutation.mutateAsync(shiftId);
    },
    [startMutation]
  );
  const endShift = useCallback(
    async (shiftId: number) => {
      await endMutation.mutateAsync(shiftId);
    },
    [endMutation]
  );
  const clockIn = useCallback(async () => {
    if (!startableToday) {
      throw new Error("Ingen vagt tilgængelig at clocke ind på i dag.");
    }
    await startShift(startableToday.shiftId);
  }, [startableToday, startShift]);
  const clockOut = useCallback(async () => {
    if (!inProgressToday) {
      throw new Error("Ingen aktiv vagt at clocke ud fra.");
    }
    await endShift(inProgressToday.shiftId);
  }, [inProgressToday, endShift]);
  return {
    shifts,
    loading,
    error,
    clockMode,
    clockIn,
    clockOut,
    todayShifts,
    inProgressToday,
    startableToday,
    startShift,
    endShift,
    refetch: shiftsQuery.refetch,
  };
};
