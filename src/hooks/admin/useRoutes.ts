import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routeService, type Route, type RoutePayload } from "../../services/routeService";

const routesKey = ["routes"] as const;

export const useRoutes = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Route[], Error>({
    queryKey: routesKey,
    queryFn: () => routeService.getAllRoutes(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: RoutePayload) => routeService.createRoute(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RoutePayload }) =>
      routeService.updateRoute(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => routeService.deleteRoute(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: routesKey });
    },
  });

  return {
    routes: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,

    createRoute: (payload: RoutePayload) => createMutation.mutateAsync(payload),
    updateRoute: (id: number, payload: RoutePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteRoute: (id: number) => deleteMutation.mutateAsync(id),
  };
};
