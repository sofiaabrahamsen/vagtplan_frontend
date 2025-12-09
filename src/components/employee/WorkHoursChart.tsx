import { Box, Heading, Text, Divider } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import type { MonthlyHoursRow } from "../../entities/WorkHours";

interface Props {
  workHours: MonthlyHoursRow[];
}

const WorkHoursChart = ({ workHours }: Props) => {
  if (!workHours.length) {
    return (
      <Box
        p={6}
        bg="white"
        borderWidth="1px"
        borderColor="gray.300"
        rounded="md"
        shadow="sm"
      >
        <Heading size="md" mb={4} color="gray.700">
          Monthly Work Hours
        </Heading>

        <Text color="gray.600">No data available.</Text>
      </Box>
    );
  }

  const chartData = workHours.map((row) => ({
    name: `${row.month}/${row.year}`,
    hours: Number(row.totalMonthlyHours),
  }));

  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.300"
      rounded="md"
      shadow="sm"
    >
      <Heading size="md" mb={4} color="gray.700">
        Monthly Work Hours
      </Heading>

      <Divider mb={4} />

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#3182CE" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WorkHoursChart;
