import { Box, Heading, Text } from "@chakra-ui/react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import type { MonthlyHoursRow } from "../../entities/WorkHours";

interface Props {
  workHours: MonthlyHoursRow[];
}

const WorkHoursChart = ({ workHours }: Props) => {
  if (!workHours.length) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
        <Heading size="md" mb={3}>Monthly Work Hours</Heading>
        <Text>No data available</Text>
      </Box>
    );
  }

  const chartData = workHours.map((row) => ({
    name: `${row.month}/${row.year}`,
    hours: Number(row.totalMonthlyHours)
  }));

  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="black">
      <Heading size="md" mb={3}>Monthly Work Hours</Heading>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WorkHoursChart;
