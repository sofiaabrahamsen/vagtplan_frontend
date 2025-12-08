import { Box, Heading, Text } from "@chakra-ui/react";

interface WorkHoursChartProps {
  month: string;
  hours: number;
}

const WorkHoursChart = ({ month, hours }: WorkHoursChartProps) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
      <Heading size="md" mb={3}>Work Hours</Heading>
      <Text>{month}: {hours} hours</Text>
    </Box>
  );
};

export default WorkHoursChart;
