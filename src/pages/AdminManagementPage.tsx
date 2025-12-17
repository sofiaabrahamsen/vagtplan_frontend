import { Box, Heading, VStack, } from "@chakra-ui/react";
import DashboardLayout, { type DashboardNavItem, } from "../components/DashboardLayout";
import AdminEmployeesSection from "../components/admin/AdminEmployeesSection";
import AdminBicyclesSection from "../components/admin/AdminBicyclesSection";
import AdminRoutesSection from "../components/admin/AdminRoutesSection";
import AdminShiftsSection from "../components/admin/AdminShiftsSection";

const AdminManagementPage = () => {
  const navItems: DashboardNavItem[] = [
    // go back to the admin dashboard profile view
    { label: "My Profile", to: "/dashboard-admin" },

    // In-page sections on the management page
    { label: "Accounts", targetId: "section-employees" },
    { label: "Bicycles", targetId: "section-bicycles" },
    { label: "Routes", targetId: "section-routes" },
    { label: "Shifts", targetId: "section-shifts" },
  ];

  return (
    <DashboardLayout title="Admin Management" navItems={navItems}>
      <VStack spacing={6} align="stretch">
        {/* EMPLOYEES & USERS */}
        <Box id="section-employees">
          <Heading size="md" mb={3} color="gray.600">
            Users
          </Heading>
          <AdminEmployeesSection />
        </Box>

        {/* BICYCLES */}
        <Box id="section-bicycles">
          <Heading size="md" mb={3} color="gray.600">
            Bicycles
          </Heading>
          <AdminBicyclesSection />
        </Box>

        {/* ROUTES */}
        <Box id="section-routes">
          <Heading size="md" mb={2} color="gray.600">
            Routes
          </Heading>
          <AdminRoutesSection />
        </Box>

        {/* SHIFTS */}
        <Box id="section-shifts">
          <Heading size="md" mb={2} color="gray.600">
            Shifts
          </Heading>
          <AdminShiftsSection />
        </Box>
      </VStack>
    </DashboardLayout>
  );
};

export default AdminManagementPage;
