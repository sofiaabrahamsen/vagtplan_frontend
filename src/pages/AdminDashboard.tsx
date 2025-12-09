import { Box, Text } from "@chakra-ui/react";
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <Box>
        <Text fontSize="xl" mb={4}>
          Welcome, Admin! Here you can manage users and view reports.
        </Text>
        {/* Additional admin-specific components go here */}
      </Box>
    </DashboardLayout>
  );
};

export default AdminDashboard;
