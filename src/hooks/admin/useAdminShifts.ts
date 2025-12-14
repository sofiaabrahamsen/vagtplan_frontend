import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "../../entities/Shift";
import { adminShiftService } from "../../services/adminShiftService";

const adminShiftsKey = ["adminShifts"] as const;

export const useAdminShifts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Shift[], Error>({
    queryKey: adminShiftsKey,
    queryFn: () => adminShiftService.getAllShifts(),
  });

  const createMutation = useMutation<void, Error, Partial<Shift>>({
    mutationFn: async (payload) => {
      await adminShiftService.createShift(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const updateMutation = useMutation<void, Error, { id: number; payload: Partial<Shift> }>({
    mutationFn: async ({ id, payload }) => {
      await adminShiftService.updateShift(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await adminShiftService.deleteShift(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const loading =
    !!isLoading || createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

  const errorMsg: string | null =
    error?.message ??
    createMutation.error?.message ??
    updateMutation.error?.message ??
    deleteMutation.error?.message ??
    null;

  return {
    shifts: data ?? [],
    loading,
    error: errorMsg,
    refetch,

    createShift: (payload: Partial<Shift>) => createMutation.mutateAsync(payload),
    updateShift: (id: number, payload: Partial<Shift>) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteShift: (id: number) => deleteMutation.mutateAsync(id),
  };
};
