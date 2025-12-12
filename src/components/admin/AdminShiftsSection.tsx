// src/components/admin/AdminShiftsSection.tsx
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import type { Shift } from "../../services/shiftService";
import { useAdminShifts } from "../../hooks/admin/useAdminShifts";
import { useGetAllEmployees } from "../../hooks/admin/useGetAllEmployees";
import { useBicycles } from "../../hooks/admin/useBicycles";
import { useRoutes } from "../../hooks/admin/useRoutes";

type Mode = "create" | "edit";

interface ShiftForm {
  shiftId?: number;
  dateOfShift: string; // "YYYY-MM-DD"
  employeeId: number | "";
  bicycleId: number | "";
  routeId: number | "";
  substitutedId: number | "" | null;
}

const emptyForm: ShiftForm = {
  dateOfShift: "",
  employeeId: "",
  bicycleId: "",
  routeId: "",
  substitutedId: "",
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("da-DK");
};

const AdminShiftsSection = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    shifts,
    loading,
    error,
    createShift,
    updateShift,
    deleteShift,
  } = useAdminShifts();

  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useGetAllEmployees();

  const {
    bicycles,
    loading: bicyclesLoading,
    error: bicyclesError,
  } = useBicycles();

  const {
    routes,
    loading: routesLoading,
    error: routesError,
  } = useRoutes();

  const [form, setForm] = useState<ShiftForm>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isEdit = mode === "edit";

  // Maps for nicer display
  const employeeMap = useMemo(
    () =>
      new Map(
        employees.map((e) => [
          e.employeeId,
          `${e.firstName} ${e.lastName}`,
        ])
      ),
    [employees]
  );

  const bicycleMap = useMemo(
    () =>
      new Map(
        bicycles.map((b) => [b.bicycleId, b.bicycleNumber])
      ),
    [bicycles]
  );

  const routeMap = useMemo(
    () =>
      new Map(
        routes.map((r) => [r.id, r.routeNumber])
      ),
    [routes]
  );

  const isFormValid =
    form.dateOfShift &&
    form.employeeId !== "" &&
    form.bicycleId !== "" &&
    form.routeId !== "";

  // -----------------------------
  // Modal helpers
  // -----------------------------
  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    onOpen();
  };

  const openEdit = (shift: Shift) => {
    const d = new Date(shift.dateOfShift);
    const yyyyMmDd = !Number.isNaN(d.getTime())
      ? d.toISOString().slice(0, 10)
      : "";

    setMode("edit");
    setForm({
      shiftId: shift.shiftId,
      dateOfShift: yyyyMmDd,
      employeeId: shift.employeeId,
      bicycleId: shift.bicycleId,
      routeId: shift.routeId,
      substitutedId: shift.substitutedId ?? "",
    });
    onOpen();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "employeeId" || name === "bicycleId" || name === "routeId") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else if (name === "substitutedId") {
      setForm((prev) => ({
        ...prev,
        substitutedId: value === "" ? "" : Number(value),
      }));
    } else if (name === "dateOfShift") {
      setForm((prev) => ({ ...prev, dateOfShift: value }));
    }
  };

  // -----------------------------
  // Save (create / update)
  // -----------------------------
  const handleSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      const dateIso = new Date(form.dateOfShift + "T00:00:00").toISOString();

      const substitutedId =
        form.substitutedId === "" || form.substitutedId == null
          ? (form.employeeId as number)
          : (form.substitutedId);

      const payload = {
        dateOfShift: dateIso,
        employeeId: form.employeeId as number,
        bicycleId: form.bicycleId as number,
        routeId: form.routeId as number,
        substitutedId,
      };

      if (isEdit && form.shiftId != null) {
        await updateShift(form.shiftId, payload);
        toast({
          title: "Shift updated",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } else {
        await createShift(payload);
        toast({
          title: "Shift created",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }

      onClose();
    } catch (err: unknown) {
      let description;  
       if (err instanceof Error) {
        description = err.message;
       } else{
        description = "Unknown error";
       }
      toast({
        title: "Save failed",
        description: description,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteShift(id);
      toast({
        title: "Shift deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err: unknown) {
      let description;
       if (err instanceof Error) {
        description = err.message;
       } else{
        description = "Unknown error";
       }
      toast({
        title: "Delete failed",
        description: description,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const anyLoading =
    loading || employeesLoading || bicyclesLoading || routesLoading;

  const anyError = error ?? employeesError ?? bicyclesError ?? routesError;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box
      p={4}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
    >
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="semibold" color="gray.700">
          Shifts
        </Text>

        <Button
          size="sm"
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={openCreate}
        >
          New shift
        </Button>
      </HStack>

      {anyLoading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading shifts...
          </Text>
        </HStack>
      )}

      {anyError && !anyLoading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">
            {anyError}
          </Text>
        </Alert>
      )}

      {!anyLoading && !anyError && shifts.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No shifts found.
        </Text>
      )}

      {!anyLoading && shifts.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.700">Date</Th>
                <Th color="gray.700">Employee</Th>
                <Th color="gray.700">Bicycle</Th>
                <Th color="gray.700">Route</Th>
                <Th color="gray.700">Substituted</Th>
                <Th color="gray.700">Total hours</Th>
                <Th color="gray.700" textAlign="right">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {shifts.map((s) => (
                <Tr key={s.shiftId}>
                  <Td color="gray.800">{formatDate(s.dateOfShift)}</Td>
                  <Td color="gray.800">
                    {employeeMap.get(s.employeeId) ?? `#${s.employeeId}`}
                  </Td>
                  <Td color="gray.800">
                    {bicycleMap.get(s.bicycleId) ?? `#${s.bicycleId}`}
                  </Td>
                  <Td color="gray.800">
                    {routeMap.get(s.routeId) ?? `#${s.routeId}`}
                  </Td>
                  <Td color="gray.800">
                    {s.substitutedId && s.substitutedId !== s.employeeId
                      ? employeeMap.get(s.substitutedId) ??
                        `#${s.substitutedId}`
                      : "Self"}
                  </Td>
                  <Td color="gray.800">
                    {s.totalHours != null ? `${s.totalHours.toFixed(2)} h` : "—"}
                  </Td>
                  <Td textAlign="right">
                    <HStack justify="flex-end" spacing={2}>
                      <IconButton
                        aria-label="Edit shift"
                        icon={<FiEdit2 />}
                        size="xs"
                        variant="ghost"
                        onClick={() => openEdit(s)}
                      />
                      <IconButton
                        aria-label="Delete shift"
                        icon={<FiTrash2 />}
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        isLoading={deletingId === s.shiftId}
                        onClick={void handleDelete(s.shiftId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEdit ? "Edit shift" : "Create shift"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mb={3}
              isRequired
              isInvalid={!form.dateOfShift}
            >
              <FormLabel>Date of shift</FormLabel>
              <Input
                type="date"
                name="dateOfShift"
                value={form.dateOfShift}
                onChange={handleChange}
              />
              {!form.dateOfShift && (
                <FormErrorMessage>Date is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              mb={3}
              isRequired
              isInvalid={form.employeeId === ""}
            >
              <FormLabel>Employee</FormLabel>
              <Select
                name="employeeId"
                placeholder="Select employee"
                value={form.employeeId === "" ? "" : String(form.employeeId)}
                onChange={handleChange}
              >
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </Select>
              {form.employeeId === "" && (
                <FormErrorMessage>
                  Employee is required.
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              mb={3}
              isRequired
              isInvalid={form.bicycleId === ""}
            >
              <FormLabel>Bicycle</FormLabel>
              <Select
                name="bicycleId"
                placeholder="Select bicycle"
                value={form.bicycleId === "" ? "" : String(form.bicycleId)}
                onChange={handleChange}
              >
                {bicycles.map((b) => (
                  <option key={b.bicycleId} value={b.bicycleId}>
                    {b.bicycleNumber}
                  </option>
                ))}
              </Select>
              {form.bicycleId === "" && (
                <FormErrorMessage>
                  Bicycle is required.
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              mb={3}
              isRequired
              isInvalid={form.routeId === ""}
            >
              <FormLabel>Route</FormLabel>
              <Select
                name="routeId"
                placeholder="Select route"
                value={form.routeId === "" ? "" : String(form.routeId)}
                onChange={handleChange}
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeNumber}
                  </option>
                ))}
              </Select>
              {form.routeId === "" && (
                <FormErrorMessage>
                  Route is required.
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Substituted employee (optional)</FormLabel>
              <Select
                name="substitutedId"
                placeholder="Same as employee"
                value={
                  form.substitutedId === "" || form.substitutedId == null
                    ? ""
                    : String(form.substitutedId)
                }
                onChange={handleChange}
              >
                {employees.map((e) => (
                  <option key={e.employeeId} value={e.employeeId}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() =>handleSave}
              isLoading={saving}
              isDisabled={!isFormValid}
            >
              {isEdit ? "Save changes" : "Create"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminShiftsSection;
