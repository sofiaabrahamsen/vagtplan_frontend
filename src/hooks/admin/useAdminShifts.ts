import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shiftService, type Shift } from "../../services/shiftService";

const adminShiftsKey = ["adminShifts"] as const;

export const useAdminShifts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Shift[], Error>({
    queryKey: adminShiftsKey,
    queryFn: () => shiftService.getAllShifts(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Shift>) => shiftService.createShift(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Shift> }) =>
      shiftService.updateShift(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => shiftService.deleteShift(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  return {
    shifts: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,

    createShift: (payload: Partial<Shift>) => createMutation.mutateAsync(payload),
    updateShift: (id: number, payload: Partial<Shift>) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteShift: (id: number) => deleteMutation.mutateAsync(id),
  };
};
