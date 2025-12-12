import {
  Badge,
  Box,
  Heading,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Shift } from "../../entities/Shift";

interface Props {
  shifts: Shift[];
}

type FilterMode = "all" | "today" | "upcoming" | "completed";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const safeDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (iso: string) => {
  const d = safeDate(iso);
  return d ? d.toLocaleDateString() : "-";
};

const formatTime = (t?: string | null) => {
  if (!t) return "-";
  // Backend returns "HH:mm:ss"
  return t.length >= 5 ? t.slice(0, 5) : t;
};

const getStatus = (s: Shift) => {
  if (s.startTime && !s.endTime) return "In progress";
  if (!s.startTime) return "Not started";
  return "Completed";
};

const statusColor = (status: string) => {
  switch (status) {
    case "In progress":
      return "green";
    case "Not started":
      return "blue";
    default:
      return "gray";
  }
};

const ShiftsTable = ({ shifts }: Props) => {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    const today = new Date();

    const normalized = (shifts ?? [])
      .filter((s) => !!s?.shiftId && !!s?.dateOfShift)
      .slice()
      .sort((a, b) => {
        const da = safeDate(a.dateOfShift)?.getTime() ?? 0;
        const db = safeDate(b.dateOfShift)?.getTime() ?? 0;
        return db - da; // newest first
      });

    if (filter === "all") return normalized;

    if (filter === "today") {
      return normalized.filter((s) => {
        const d = safeDate(s.dateOfShift);
        return d ? isSameDay(d, today) : false;
      });
    }

    if (filter === "upcoming") {
      return normalized.filter((s) => {
        const d = safeDate(s.dateOfShift);
        return d ? d > today && !s.startTime : false;
      });
    }

    // completed
    return normalized.filter((s) => !!s.startTime && !!s.endTime);
  }, [shifts, filter]);

  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
      color="gray.700"
    >
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="md" color="gray.700">
          My Shifts
        </Heading>

        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterMode)}
          maxW="180px"
          size="sm"
          bg="gray"
            sx={{
              option: {
                backgroundColor: "var(--chakra-colors-gray-700)",
                color: "var(--chakra-colors-white)",
              },
            }}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </Select>
      </HStack>

      {filtered.length === 0 ? (
        <Box
          p={4}
          bg="gray.50"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="md"
        >
          <Text fontSize="sm" color="gray.600">
            No shifts found for this filter.
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={3}>
          <Box borderWidth="1px" borderColor="gray.200" rounded="md" overflow="hidden">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Date</Th>
                  <Th>Route</Th>
                  <Th>Start</Th>
                  <Th>End</Th>
                  <Th isNumeric>Total hours</Th>
                  <Th>Substitute</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((shift) => {
                  const status = getStatus(shift);

                  return (
                    <Tr key={shift.shiftId}>
                      <Td>{formatDate(shift.dateOfShift)}</Td>
                      <Td>{shift.routeId}</Td>
                      <Td>{formatTime(shift.startTime)}</Td>
                      <Td>{formatTime(shift.endTime)}</Td>
                      <Td isNumeric>
                        {shift.totalHours ?? "-"}
                      </Td>
                      <Td>{shift.substitutedId ?? "-"}</Td>
                      <Td>
                        <Badge colorScheme={statusColor(status)} variant="subtle">
                          {status}
                        </Badge>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default ShiftsTable;
