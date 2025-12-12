import { useCallback, useEffect, useState } from "react";
import { shiftService, type Shift } from "../../services/shiftService";

export const useAdminShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await shiftService.getAllShifts();
      setShifts(data ?? []);
    } catch (err: unknown) {
       if (err instanceof Error) {
      setError(err?.message );
       } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchShifts();
  }, [fetchShifts]);

  const createShift = useCallback(async (data: Partial<Shift>) => {
    const created = await shiftService.createShift(data);
    // If backend returns the created shift
    if (created) {
      setShifts((prev) => [...prev, created]);
    } else {
      // fallback: just refetch
      void fetchShifts();
    }
  }, [fetchShifts]);

  const updateShift = useCallback(
    async (id: number, data: Partial<Shift>) => {
      await shiftService.updateShift(id, data);
      setShifts((prev) =>
        prev.map((s) => (s.shiftId === id ? { ...s, ...data } as Shift : s))
      );
    },
    []
  );

  const deleteShift = useCallback(async (id: number) => {
    await shiftService.deleteShift(id);
    setShifts((prev) => prev.filter((s) => s.shiftId !== id));
  }, []);

  return {
    shifts,
    loading,
    error,
    refetch: fetchShifts,
    createShift,
    updateShift,
    deleteShift,
  };
};