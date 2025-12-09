import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import type { Shift } from "../../entities/Shift";

interface Props {
  shifts: Shift[];
}

const ShiftsTable = ({ shifts }: Props) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="blue.600">
      <Heading size="md" mb={3}>My Shifts</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Substitute</Th>
          </Tr>
        </Thead>
        <Tbody>
          {shifts.map((shift) => (
            <Tr key={shift.id}>
              <Td>{new Date(shift.date).toLocaleDateString()}</Td>
              <Td>{shift.startTime ?? "-"}</Td>
              <Td>{shift.endTime ?? "-"}</Td>
              <Td>{shift.substitute ?? "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ShiftsTable;
