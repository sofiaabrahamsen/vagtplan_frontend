import { useCallback, useEffect, useState } from "react";
import { bicycleService, type Bicycle, type BicyclePayload } from "../../services/bicycleService";

export const useBicycles = () => {
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBicycles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await bicycleService.getAllBicycles();
      setBicycles(data);
    } catch (err: unknown) {
      let description:string;
      if(err instanceof Error){
        description = err.message;
      } else {
        description = "Unknown error";
      }
      setError(description);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBicycles();
  }, [fetchBicycles]);

  const createBicycle = useCallback(
    async (payload: BicyclePayload) => {
      const created = await bicycleService.createBicycle(payload);
      setBicycles((prev) => [...prev, created]);
      return created;
    },
    []
  );

  const updateBicycle = useCallback(
    async (id: number, payload: BicyclePayload) => {
      await bicycleService.updateBicycle(id, payload);
      setBicycles((prev) =>
        prev.map((b) => (b.bicycleId === id ? { ...b, ...payload } : b))
      );
    },
    []
  );

  const deleteBicycle = useCallback(async (id: number) => {
    await bicycleService.deleteBicycle(id);
    setBicycles((prev) => prev.filter((b) => b.bicycleId !== id));
  }, []);

  return {
    bicycles,
    loading,
    error,
    refetch: fetchBicycles,
    createBicycle,
    updateBicycle,
    deleteBicycle,
  };
};
