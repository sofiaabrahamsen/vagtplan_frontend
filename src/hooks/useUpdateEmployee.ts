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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await employeeClient.update(employee.employeeId, payload as any);

      return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { updateEmployee };
};
