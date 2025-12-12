import {
  Box,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

import type { Employee } from "../../entities/Employee";
import EditPersonalInfoModal from "../EditPersonalInfoModal";
import { useGetAllEmployees } from "../../hooks/admin/useGetAllEmployees";
import type { EmployeePayload } from "../../services/employeeService";

const emptyForm: EmployeePayload = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

const AdminEmployeesSection = () => {
  const toast = useToast();

  // All data & CRUD via hook
  const {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useGetAllEmployees();

  // CREATE modal state
  const [form, setForm] = useState<EmployeePayload>(emptyForm);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // EDIT modal state (reusing EditPersonalInfoModal)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // -----------------------------
  // CREATE helpers
  // -----------------------------
  const handleCreateOpen = () => {
    setForm(emptyForm);
    onOpen();
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.phone.trim()
    );
  }, [form]);

  const handleCreateSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      await createEmployee({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address?.trim() ?? "",
      });

      toast({
        title: "Employee created",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      onClose();
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err?.message ?? "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // EDIT helpers (EditPersonalInfoModal)
  // -----------------------------
  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setEditingEmployee(null);
    setIsEditOpen(false);
  };

  const handleEditSave = async (updated: Employee) => {
    try {
      if (!updated.employeeId) throw new Error("Missing employee id");

      await updateEmployee(updated.employeeId, {
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
      });

      toast({
        title: "Employee updated",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      handleEditClose();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message ?? "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // -----------------------------
  // DELETE helpers
  // -----------------------------
  const handleDelete = async (employeeId: number) => {
    setDeletingId(employeeId);
    try {
      await deleteEmployee(employeeId);

      toast({
        title: "Employee deleted",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err?.message ?? "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

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
      color="gray.800"
    >
      <HStack justify="space-between" mb={4}>
        <Button
          size="sm"
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={handleCreateOpen}
        >
          New employee
        </Button>
      </HStack>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading employees...
          </Text>
        </HStack>
      )}

      {error && !loading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && employees.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No employees found.
        </Text>
      )}

      {!loading && employees.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>ID</Th>
                <Th>First name</Th>
                <Th>Last name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {employees.map((e) => (
                <Tr key={e.employeeId}>
                  <Td>{e.employeeId}</Td>
                  <Td>{e.firstName}</Td>
                  <Td>{e.lastName}</Td>
                  <Td>{e.email}</Td>
                  <Td>{e.phone}</Td>
                  <Td>{e.address}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit employee"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => openEdit(e)}
                      />
                      <IconButton
                        aria-label="Delete employee"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        isLoading={deletingId === e.employeeId}
                        onClick={() => handleDelete(e.employeeId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>First name</FormLabel>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleCreateChange}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Last name</FormLabel>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleCreateChange}
              />
            </FormControl>
            <FormControl mb={3} isRequired isInvalid={!form.email.trim()}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleCreateChange}
              />
              {!form.email.trim() && (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mb={3} isRequired isInvalid={!form.phone.trim()}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleCreateChange}
              />
              {!form.phone.trim() && (
                <FormErrorMessage>Phone is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={form.address ?? ""}
                onChange={handleCreateChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateSave}
              isLoading={saving}
              isDisabled={!isFormValid}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */ }
      <EditPersonalInfoModal
        user={editingEmployee}
        isOpen={isEditOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </Box>
  );
};

export default AdminEmployeesSection;
