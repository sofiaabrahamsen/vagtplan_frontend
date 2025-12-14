import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bicycleService,
  type Bicycle,
  type BicyclePayload,
} from "../../services/bicycleService";

// 1) Query key = “navnet” på cachen for listen
const bicyclesKey = ["bicycles"] as const;

export const useBicycles = () => {
  const queryClient = useQueryClient();

  // 2) useQuery = henter data + cacher
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Bicycle[], Error>({
    queryKey: bicyclesKey,
    queryFn: () => bicycleService.getAllBicycles(),
  });

  // 3) useMutation = ændrer data på serveren
  //    Når den lykkes => invalidér listen => React Query henter listen igen
  const createMutation = useMutation({
    mutationFn: (payload: BicyclePayload) => bicycleService.createBicycle(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BicyclePayload }) =>
      bicycleService.updateBicycle(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bicycleService.deleteBicycle(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bicyclesKey });
    },
  });

  // 4) Return
  return {
    bicycles: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,

    refetch,

    createBicycle: (payload: BicyclePayload) => createMutation.mutateAsync(payload),
    updateBicycle: (id: number, payload: BicyclePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteBicycle: (id: number) => deleteMutation.mutateAsync(id),
  };
};
