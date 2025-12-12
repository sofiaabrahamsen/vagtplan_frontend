import { useCallback, useEffect, useMemo, useState } from "react";
import type { Shift } from "../entities/Shift";

// Helpers
const pad = (n: number) => String(n).padStart(2, "0");

const nowAsTimeSpanString = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const safeDate = (iso?: string) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const parseTimeToMinutes = (time?: string | null) => {
  if (!time) return null;
  const parts = time.split(":").map(Number);
  if (parts.length < 2 || parts.some((p) => Number.isNaN(p))) return null;
  const [h, m, s = 0] = parts;
  return h * 60 + m + s / 60;
};

const calcHours = (start?: string | null, end?: string | null) => {
  const sm = parseTimeToMinutes(start);
  const em = parseTimeToMinutes(end);
  if (sm == null || em == null) return null;

  const diffMinutes = em - sm;
  if (diffMinutes < 0) return null;
  return Math.round((diffMinutes / 60) * 100) / 100;
};

export type ClockMode = "in" | "out" | "unavailable";

export const useShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
  const apiUrl = import.meta.env["VITE_API_URL"];

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response:Response = await fetch(`${apiUrl}/Employee/get-employee-shifts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch employee shifts");

      const data:unknown = await response.json();

      if(!Array.isArray(data)) throw new Error("Invalid data format received");

      const formatted = data as Shift[];

      setShifts(formatted);
    } catch (err: unknown) {
       if (err instanceof Error) {
      setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    void fetchShifts();
  }, [fetchShifts]);

  // -----------------------------
  // Derive today’s shift
  // -----------------------------
  const todayShifts = useMemo(() => {
    const today = new Date();
    return (shifts ?? []).filter((s) => {
      const d = safeDate(s.dateOfShift);
      return d ? isSameDay(d, today) : false;
    });
  }, [shifts]);

  // If employee can have multiple shifts today, this picks:
  // 1) in-progress first
  // 2) otherwise a startable one
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

  // -----------------------------
  // Low-level actions (id-based)
  // -----------------------------
  const startShift = useCallback(
    async (shiftId: number): Promise<void> => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const startTime = nowAsTimeSpanString();

      const response = await fetch(
        `${apiUrl}/Shift/${shiftId}/start?startTime=${encodeURIComponent(
          startTime
        )}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to start shift");

      setShifts((prev) =>
        prev.map((s) =>
          s.shiftId === shiftId
            ? { ...s, startTime, endTime: null, totalHours: null }
            : s
        )
      );
    },
    [apiUrl]
  );

  const endShift = useCallback(
    async (shiftId: number): Promise<void> => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const endTime = nowAsTimeSpanString();

      const response = await fetch(
        `${apiUrl}/Shift/${shiftId}/end?endTime=${encodeURIComponent(endTime)}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to end shift");

      setShifts((prev) =>
        prev.map((s) => {
          if (s.shiftId !== shiftId) return s;

          const calculated = calcHours(s.startTime ?? null, endTime);

          return {
            ...s,
            endTime,
            totalHours: calculated ?? s.totalHours ?? null,
          };
        })
      );
    },
    [apiUrl]
  );

  // -----------------------------
  // Button-level actions (no id)
  // -----------------------------
  const clockIn = useCallback(async (): Promise<void> => {
    if (!startableToday) {
      throw new Error("No shift available to clock in today.");
    }
    await startShift(startableToday.shiftId);
  }, [startableToday, startShift]);

  const clockOut = useCallback(async (): Promise<void> => {
    if (!inProgressToday) {
      throw new Error("No active shift to clock out from.");
    }
    await endShift(inProgressToday.shiftId);
  }, [inProgressToday, endShift]);

  return {
    shifts,
    loading,
    error,

    // button UX
    clockMode,
    clockIn,
    clockOut,

    // useful for other UI
    startShift,
    endShift,
    refetch: fetchShifts,

    // optional info
    todayShifts,
    inProgressToday,
    startableToday,
  };
};
