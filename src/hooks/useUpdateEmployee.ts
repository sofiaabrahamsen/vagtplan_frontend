import type { Employee } from "../entities/Employee";
import ApiClient from "../services/api-client";

const employeeClient = new ApiClient<Employee>("/Employees");

export const useUpdateEmployee = () => {
  const updateEmployee = async (employee: Employee) => {
    try {
      // Map frontend camelCase fields to backend PascalCase DTO
      const payload = {
        FirstName: employee.firstName,
        LastName: employee.lastName,
        Email: employee.email,
        Phone: employee.phone,
        Address: employee.address
      };

      await employeeClient.update(employee.employeeId, payload as Partial<Employee>);

      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return undefined;
    }
  };

  return { updateEmployee };
};
