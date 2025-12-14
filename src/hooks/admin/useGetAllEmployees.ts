import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "../../entities/Employee";
import {
  adminEmployeeService,
  type AdminEmployeeCreatePayload,
  type AdminEmployeeUpdatePayload,
} from "../../services/adminEmployeeService";

const employeesKey = ["employees"] as const;

export const useGetAllEmployees = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Employee[], Error>({
    queryKey: employeesKey,
    queryFn: () => adminEmployeeService.getAllEmployees(),
  });

  const createMutation = useMutation<void, Error, AdminEmployeeCreatePayload>({
    mutationFn: async (payload) => {
      await adminEmployeeService.createEmployee(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
    },
  });

  const updateMutation = useMutation<
    void,
    Error,
    { id: number; payload: AdminEmployeeUpdatePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      await adminEmployeeService.updateEmployee(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await adminEmployeeService.deleteEmployee(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
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
    employees: data ?? [],
    loading,
    error: errorMsg,
    refetch,

    createEmployee: (payload: AdminEmployeeCreatePayload) =>
      createMutation.mutateAsync(payload),

    updateEmployee: (id: number, payload: AdminEmployeeUpdatePayload) =>
      updateMutation.mutateAsync({ id, payload }),

    deleteEmployee: (id: number) => deleteMutation.mutateAsync(id),
  };
};
