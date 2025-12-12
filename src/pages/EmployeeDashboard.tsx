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
import ClockInOutSection from "../components/dashboard/ClockInOutSection";
import PersonalInfoCard from "../components/dashboard/PersonalInfoCard";
import RoutesList from "../components/dashboard/RoutesList";
import ShiftsTable from "../components/dashboard/ShiftsTable";
import WeatherSection from "../components/dashboard/WeatherSection";
import WorkHoursChart from "../components/dashboard/WorkHoursChart";


import type { Employee } from "../entities/Employee";
import { useEmployeeDashboard } from "../hooks/useDashboardData";
import { useShifts } from "../hooks/useShifts";
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
    clockMode,
    clockIn,
    clockOut,
  } = useShifts();

  const { updateEmployee } = useUpdateEmployee();

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    setEmployee(fetchedEmployee ?? null);
  }, [fetchedEmployee]);

  const handleEditClick = () => {
    if (!employee) return;
    setModalEmployee({ ...employee });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalEmployee(null);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    try {
      const result = await updateEmployee(updatedEmployee);

      if (result?.success) {
        setEmployee(updatedEmployee);
        handleCloseModal();
      } else {
        alert(result?.error ?? "Failed to update employee");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Unexpected error while updating employee");
    }
  };

  const hasRoutes = useMemo(() => routes && routes.length > 0, [routes]);
  const hasWorkHours = useMemo(
    () => workHours && workHours.length > 0,
    [workHours]
  );
  const hasShifts = useMemo(() => shifts && shifts.length > 0, [shifts]);

  const navItems: DashboardNavItem[] = [
    { label: "Profile", targetId: "section-profile" },
    { label: "Clock in/out", targetId: "section-clock" },
    { label: "Shifts", targetId: "section-shifts" },
    { label: "Work hours", targetId: "section-hours" },
    { label: "Weather", targetId: "section-weather" },
    { label: "Routes", targetId: "section-routes" },
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

        {/* PROFILE */}
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

        {/* CLOCK IN/OUT (button-only UX) */}
        <Box id="section-clock">
          <ClockInOutSection
            mode={clockMode}
            loading={shiftsLoading}
            error={shiftsError}
            onClockIn={clockIn}
            onClockOut={clockOut}
          />
        </Box>

        {/* SHIFTS OVERVIEW */}
        <Box id="section-shifts">
          {shiftsLoading && <Spinner />}

          {shiftsError && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{shiftsError}</AlertDescription>
            </Alert>
          )}

          {!shiftsLoading && hasShifts && <ShiftsTable shifts={shifts} />}

          {!shiftsLoading && shifts.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              You have no shifts.
            </Alert>
          )}
        </Box>

        {/* WORK HOURS */}
        <Box id="section-hours">
          {hasWorkHours && <WorkHoursChart workHours={workHours} />}

          {!loading && workHours.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              No work hours available.
            </Alert>
          )}
        </Box>

        {/* WEATHER */}
        <Box id="section-weather">
          <WeatherSection />
        </Box>

        {/* ROUTES */}
        <Box id="section-routes">
          {hasRoutes && <RoutesList routes={routes} />}

          {!loading && routes.length === 0 && (
            <Alert status="info">
              <AlertIcon />
              No routes assigned.
            </Alert>
          )}
        </Box>

        {/* EDIT MODAL */}
        <EditPersonalInfoModal
          user={modalEmployee}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSave={handleSave}
        />
      </VStack>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
