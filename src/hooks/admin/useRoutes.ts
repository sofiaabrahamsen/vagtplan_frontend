import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Route } from "../../entities/Route";
import { routeService, type RoutePayload } from "../../services/routeService";

const routesKey = ["routes"] as const;

export const useRoutes = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Route[], Error>({
    queryKey: routesKey,
    queryFn: () => routeService.getAllRoutes(),
  });

  const createMutation = useMutation<void, Error, RoutePayload>({
    mutationFn: async (payload) => {
      await routeService.createRoute(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  const updateMutation = useMutation<void, Error, { id: number; payload: RoutePayload }>({
    mutationFn: async ({ id, payload }) => {
      await routeService.updateRoute(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await routeService.deleteRoute(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  const loading =
    !!isLoading ||
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading;

  const errorMsg: string | null =
    error?.message ??
    createMutation.error?.message ??
    updateMutation.error?.message ??
    deleteMutation.error?.message ??
    null;

  return {
    routes: data ?? [],
    loading,
    error: errorMsg,
    refetch,

    createRoute: (payload: RoutePayload) => createMutation.mutateAsync(payload),
    updateRoute: (id: number, payload: RoutePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteRoute: (id: number) => deleteMutation.mutateAsync(id),
  };
};
