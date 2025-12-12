// src/hooks/admin/useRoutes.ts
import { useCallback, useEffect, useState } from "react";
import {
  routeService,
  type Route,
  type RoutePayload,
} from "../../services/routeService";

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await routeService.getAllRoutes();
      setRoutes(data);
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
    void fetchRoutes();
  }, [fetchRoutes]);

  const createRoute = useCallback(async (payload: RoutePayload) => {
    const created = await routeService.createRoute(payload);
    setRoutes((prev) => [...prev, created]);
    return created;
  }, []);

  const updateRoute = useCallback(
    async (id: number, payload: RoutePayload) => {
      await routeService.updateRoute(id, payload);
      setRoutes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...payload } : r))
      );
    },
    []
  );

  const deleteRoute = useCallback(async (id: number) => {
    await routeService.deleteRoute(id);
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    routes,
    loading,
    error,
    refetch: fetchRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
  };
};
