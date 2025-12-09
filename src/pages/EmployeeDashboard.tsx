import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout, {
  type DashboardNavItem,
} from "../components/DashboardLayout";

import EditPersonalInfoModal from "../components/EditPersonalInfoModal";
import PersonalInfoCard from "../components/employee/PersonalInfoCard";
import RoutesList from "../components/employee/RoutesList";
import WorkHoursChart from "../components/employee/WorkHoursChart";
import ShiftsTable from "../components/employee/ShiftsTable";

import type { Employee } from "../entities/Employee";
import { useEmployeeDashboard } from "../hooks/useEmployeeDashboard";
import { useEmployeeShifts } from "../hooks/useEmployeeShifts";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";

const EmployeeDashboard = () => {
  const {
    employee: fetchedEmployee,
    routes,
    workHours,
    loading,
    error,
  } = useEmployeeDashboard();

  const {
    shifts,
    loading: shiftsLoading,
    error: shiftsError,
  } = useEmployeeShifts();

  const { updateEmployee } = useUpdateEmployee();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);

  // Keep local employee synced with fetched employee
  useEffect(() => {
    setEmployee(fetchedEmployee ?? null);
  }, [fetchedEmployee]);

  const handleEditClick = () => {
    if (!employee) return;
    setModalEmployee({ ...employee }); // Clone the object
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalEmployee(null);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    try {
      const result = await updateEmployee(updatedEmployee);

      if (result.success) {
        setEmployee(updatedEmployee);
        handleCloseModal();
      } else {
        alert(result.error || "Failed to update employee");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Unexpected error while updating employee");
    }
  };

  // Convenience flags
  const hasRoutes = useMemo(() => routes && routes.length > 0, [routes]);
  const hasWorkHours = useMemo(
    () => workHours && workHours.length > 0,
    [workHours]
  );
  const hasShifts = useMemo(() => shifts && shifts.length > 0, [shifts]);

  // Dashboard Navigation
  const navItems: DashboardNavItem[] = [
    { label: "Profile", targetId: "section-profile" },
    { label: "Routes", targetId: "section-routes" },
    { label: "Shifts", targetId: "section-shifts" },
    { label: "Work hours", targetId: "section-hours" },
  ];

  return (
    <DashboardLayout title="Employee Dashboard" navItems={navItems}>
      <VStack spacing={6} align="stretch">
        {/* Global loading */}
        {loading && (
          <Box>
            <Spinner />
          </Box>
        )}

        {/* Global error */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {/* PROFILE SECTION */}
        <Box id="section-profile">
          {employee && (
            <PersonalInfoCard user={employee} onEditClick={handleEditClick} />
          )}

          {!loading && !error && !employee && (
            <Alert status="info">
              <AlertIcon />
              No employee data could be found.
            </Alert>
          )}
        </Box>

        {/* ROUTES SECTION */}
        <Box id="section-routes">
          {hasRoutes && <RoutesList routes={routes} />}

          {!loading && routes.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              No routes assigned.
            </Alert>
          )}
        </Box>

        {/* SHIFTS SECTION */}
        <Box id="section-shifts">
          {shiftsLoading && <Spinner />}

          {shiftsError && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{shiftsError}</AlertDescription>
            </Alert>
          )}

          {!shiftsLoading && hasShifts && (
            <ShiftsTable shifts={shifts} />
          )}

          {!shiftsLoading && shifts.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              You have no shifts.
            </Alert>
          )}
        </Box>

        {/* WORK HOURS SECTION */}
        <Box id="section-hours">
          {hasWorkHours && <WorkHoursChart workHours={workHours} />}

          {!loading && workHours.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              No work hours available.
            </Alert>
          )}
        </Box>

        {/* EDIT MODAL */}
        <EditPersonalInfoModal
          user={modalEmployee}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </VStack>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
