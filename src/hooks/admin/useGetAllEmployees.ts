import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "../../entities/Employee";
import { employeeService, type EmployeePayload } from "../../services/employeeService";

const employeesKey = ["employees"] as const;

export const useGetAllEmployees = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Employee[], Error>({
    queryKey: employeesKey,
    queryFn: () => employeeService.getAllEmployees(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: EmployeePayload) => employeeService.createEmployee(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EmployeePayload }) =>
      employeeService.updateEmployee(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeService.deleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeesKey });
    },
  });

  return {
    employees: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,

    createEmployee: (payload: EmployeePayload) => createMutation.mutateAsync(payload),
    updateEmployee: (id: number, payload: EmployeePayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deleteEmployee: (id: number) => deleteMutation.mutateAsync(id),
  };
};
