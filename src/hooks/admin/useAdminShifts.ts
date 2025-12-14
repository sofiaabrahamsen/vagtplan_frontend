import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "../../entities/Shift";
import {
  adminShiftService,
  type AdminShiftPayload,
} from "../../services/adminShiftService";

const adminShiftsKey = ["adminShifts"] as const;

export const useAdminShifts = () => {
  const queryClient = useQueryClient();

  const shiftsQuery = useQuery<Shift[], Error>({
    queryKey: adminShiftsKey,
    queryFn: () => adminShiftService.getAllShifts(),
  });

  const createMutation = useMutation<void, Error, AdminShiftPayload>({
    mutationFn: (payload) => adminShiftService.createShift(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminShiftsKey });
    },
  });

  const updateMutation = useMutation<void, Error, { id: number; payload: AdminShiftPayload }>({
    mutationFn: ({ id, payload }) => adminShiftService.updateShift(id, payload),
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
    !!shiftsQuery.isLoading ||
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading;

  const errorMsg: string | null =
    shiftsQuery.error?.message ??
    createMutation.error?.message ??
    updateMutation.error?.message ??
    deleteMutation.error?.message ??
    null;

  return {
    shifts: shiftsQuery.data ?? [],
    loading,
    error: errorMsg,
    refetch: shiftsQuery.refetch,

    createShift: (payload: AdminShiftPayload) => createMutation.mutateAsync(payload),
    updateShift: (id: number, payload: AdminShiftPayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteShift: (id: number) => deleteMutation.mutateAsync(id),
  };
};
