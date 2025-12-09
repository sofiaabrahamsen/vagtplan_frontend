import { useEffect, useState } from "react";
import type { Shift } from "../entities/Shift";

export const useEmployeeShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const apiUrl = import.meta.env["VITE_API_URL"];

        const response = await fetch(`${apiUrl}/Employee/get-employee-shifts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch employee shifts");

        const data = await response.json();

        const formatted: Shift[] = data.map((s: any) => ({
          shiftId: s.shiftId,
          dateOfShift: s.dateOfShift,
          substitutedId: s.substitutedId,
          routeId: s.routeId,
          startTime: s.startTime ?? null,
          endTime: s.endTime ?? null,
          totalHours: s.totalHours ?? null,
        }));

        setShifts(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  return { shifts, loading, error };
};
