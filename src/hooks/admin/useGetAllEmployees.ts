import { useCallback, useEffect, useState } from "react";
import type { Employee } from "../../entities/Employee";
import {
  employeeService,
  type EmployeePayload,
} from "../../services/employeeService";

export const useGetAllEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err: unknown) {
       if (err instanceof Error) {
      setError(err?.message);
    } else {
      setError("An unknown error occurred");
    }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = useCallback(
    async (payload: EmployeePayload) => {
      const created = await employeeService.createEmployee(payload);
      setEmployees((prev) => prev.concat({employeeId:prev.length+1, ...payload}));
      return created;
    },
    []
  );

  const updateEmployee = useCallback(
    async (id: number, payload: EmployeePayload) => {
      await employeeService.updateEmployee(id, payload);
      setEmployees((prev) =>
        prev.map((e) => (e.employeeId === id ? { ...e, ...payload } : e))
      );
    },
    []
  );

  const deleteEmployee = useCallback(async (id: number) => {
    await employeeService.deleteEmployee(id);
    setEmployees((prev) => prev.filter((e) => e.employeeId !== id));
  }, []);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
