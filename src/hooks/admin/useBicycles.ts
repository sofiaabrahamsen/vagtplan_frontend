import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bicycle } from "../../entities/Bicycle";
import { bicycleService, type BicyclePayload } from "../../services/bicycleService";

const bicyclesKey = ["bicycles"] as const;

export const useBicycles = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Bicycle[], Error>({
    queryKey: bicyclesKey,
    queryFn: () => bicycleService.getAllBicycles(),
  });

  const createMutation = useMutation<void, Error, BicyclePayload>({
    mutationFn: async (payload) => {
      await bicycleService.createBicycle(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
    },
  });

  const updateMutation = useMutation<void, Error, { id: number; payload: BicyclePayload }>({
    mutationFn: async ({ id, payload }) => {
      await bicycleService.updateBicycle(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await bicycleService.deleteBicycle(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
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
    bicycles: data ?? [],
    loading,
    error: errorMsg,
    refetch,

    createBicycle: (payload: BicyclePayload) => createMutation.mutateAsync(payload),
    updateBicycle: (id: number, payload: BicyclePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteBicycle: (id: number) => deleteMutation.mutateAsync(id),
  };
};
