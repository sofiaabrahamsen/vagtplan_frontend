import { useEffect, useState } from "react";
import type { Bicycle } from "../entities/Bicycle";
import bicyclesClient from "../services/bicycles";

export function useBicycles() {
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bicyclesClient.getAll()
      .then(setBicycles)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { bicycles, loading, error };
}