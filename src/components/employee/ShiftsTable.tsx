import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";
import type { Shift } from "../../entities/Shift";

interface Props {
  shifts: Shift[];
}

const ShiftsTable = ({ shifts }: Props) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" bg="blue.600" color="white">
      <Heading size="md" mb={3}>My Shifts</Heading>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th color="white">Date</Th>
            <Th color="white">Start</Th>
            <Th color="white">End</Th>
            <Th color="white">Hours</Th>
            <Th color="white">Substitute</Th>
          </Tr>
        </Thead>

        <Tbody>
          {shifts.map((shift) => (
            <Tr key={shift.shiftId}>
              <Td>{new Date(shift.dateOfShift).toLocaleDateString()}</Td>
              <Td>{shift.startTime ?? "-"}</Td>
              <Td>{shift.endTime ?? "-"}</Td>
              <Td>{shift.totalHours ?? "-"}</Td>

              <Td>
                <Badge>
                  Substitute #{shift.substitutedId}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ShiftsTable;
