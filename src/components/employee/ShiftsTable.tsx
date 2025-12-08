import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from "@chakra-ui/react";

interface Shift {
  date: string;
  startTime: string;
  endTime: string;
  substitute?: string;
}

interface ShiftsTableProps {
  shifts: Shift[];
}

const ShiftsTable = ({ shifts }: ShiftsTableProps) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
      <Heading size="md" mb={3}>My Shifts</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Start</Th>
            <Th>End</Th>
            <Th>Substitute</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shifts.map((shift, idx) => (
            <Tr key={idx}>
              <Td>{shift.date}</Td>
              <Td>{shift.startTime}</Td>
              <Td>{shift.endTime}</Td>
              <Td>{shift.substitute || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ShiftsTable;
