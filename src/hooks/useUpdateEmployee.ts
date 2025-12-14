import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "../entities/Employee";
import ApiClient from "../services/api-client";

// Backend expects PascalCase DTO (not Employee)
interface UpdateEmployeeDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string;
}

const employeeClient = new ApiClient<UpdateEmployeeDto>("/Employees");

type UpdateResult =
  | { success: true }
  | { success: false; error: string }
  | undefined;

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, Employee>({
    mutationFn: async (employee: Employee) => {
      const payload: UpdateEmployeeDto = {
        FirstName: employee.firstName,
        LastName: employee.lastName,
        Email: employee.email,
        Phone: employee.phone,
        Address: employee.address,
      };

      await employeeClient.update(employee.employeeId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      await queryClient.invalidateQueries({ queryKey: ["employeeRoutes"] });
      await queryClient.invalidateQueries({ queryKey: ["workHoursLast3Months"] });
    },
  });

  const updateEmployee = async (employee: Employee): Promise<UpdateResult> => {
    try {
      await mutation.mutateAsync(employee);
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) return { success: false, error: err.message };
      return undefined;
    }
  };

  return {
    updateEmployee,
    isUpdating: mutation.isLoading,
    updateError: mutation.error?.message ?? null,
  };
};
