// src/components/admin/AdminBicyclesSection.tsx
import React, { useMemo, useState } from "react";
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
  Spinner,
  Switch,
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
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import type { Bicycle } from "../../services/bicycleService";
import type { BicyclePayload } from "../../services/bicycleService";
import { useBicycles } from "../../hooks/admin/useBicycles";

type Mode = "create" | "edit";

type BicycleForm = {
  bicycleId?: number;
  // 👇 Always string in the form, we convert to number on save
  bicycleNumber: string;
  inOperate: boolean;
};

const emptyForm: BicycleForm = {
  bicycleNumber: "",
  inOperate: true,
};

const AdminBicyclesSection: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    bicycles,
    loading,
    error,
    createBicycle,
    updateBicycle,
    deleteBicycle,
  } = useBicycles();

  const [form, setForm] = useState<BicycleForm>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isEdit = mode === "edit";

  // -----------------------------
  // Validation helpers
  // -----------------------------
  const isFormValid = useMemo(() => {
    const raw = String(form.bicycleNumber ?? "").trim();
    if (!raw) return false;
    return !Number.isNaN(Number(raw));
  }, [form.bicycleNumber]);

  const currentNumberError = useMemo(() => {
    const raw = String(form.bicycleNumber ?? "").trim();
    if (!raw) return "Bicycle number is required.";
    if (Number.isNaN(Number(raw))) return "Bicycle number must be a valid number.";
    return "";
  }, [form.bicycleNumber]);

  // -----------------------------
  // Modal helpers
  // -----------------------------
  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    onOpen();
  };

  const openEdit = (bicycle: Bicycle) => {
    setMode("edit");
    setForm({
      bicycleId: bicycle.bicycleId,
      bicycleNumber: String(bicycle.bicycleNumber ?? ""),
      inOperate: bicycle.inOperate,
    });
    onOpen();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------
  // Save (create / update)
  // -----------------------------
  const handleSave = async () => {
    if (!isFormValid) return;

    setSaving(true);
    try {
      const raw = String(form.bicycleNumber ?? "").trim();
      const bicycleNumber = Number(raw);

      if (Number.isNaN(bicycleNumber)) {
        toast({
          title: "Invalid bicycle number",
          description: "Please enter a valid number.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setSaving(false);
        return;
      }

      const payload: BicyclePayload = {
        bicycleNumber,
        inOperate: form.inOperate,
      };

      if (isEdit && form.bicycleId != null) {
        await updateBicycle(form.bicycleId, payload);
        toast({
          title: "Bicycle updated",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } else {
        await createBicycle(payload);
        toast({
          title: "Bicycle created",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }

      onClose();
  } catch (err: any) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    console.error("Save bicycle error", status, data);

    // Try to pull a useful message from the backend if it exists
    let description =
      (data && (data.error || data.message)) ||
      err?.message ||
      "Unknown error";

    // 🧠 Special-case: 500 on this endpoint is very often "duplicate bicycle number"
    if (status === 500) {
      description =
        "The bicycle number you entered is not accepted. Often this means a bicycle with this number already exists. Please choose another number.";
    }

    // Also handle explicit conflict (if backend later returns 409)
    if (status === 409) {
      description =
        "A bicycle with this number already exists. Please choose another number.";
    }

    toast({
      title: "Save failed",
      description,
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
      await deleteBicycle(id);
      toast({
        title: "Bicycle deleted",
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
    >
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="semibold" color="gray.700">
          Bicycles
        </Text>

        <Button
          size="sm"
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={openCreate}
        >
          New bicycle
        </Button>
      </HStack>

      {loading && (
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Loading bicycles...
          </Text>
        </HStack>
      )}

      {error && !loading && (
        <Alert status="error" mb={3}>
          <AlertIcon />
          <Text fontSize="sm">{error}</Text>
        </Alert>
      )}

      {!loading && !error && bicycles.length === 0 && (
        <Text fontSize="sm" color="gray.600">
          No bicycles found.
        </Text>
      )}

      {!loading && bicycles.length > 0 && (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.700">Number</Th>
                <Th color="gray.700">In operate</Th>
                <Th color="gray.700" textAlign="right">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {bicycles.map((b) => (
                <Tr key={b.bicycleId}>
                  <Td color="gray.800">{b.bicycleNumber}</Td>
                  <Td color="gray.800">{b.inOperate ? "Yes" : "No"}</Td>
                  <Td>
                    <HStack justify="flex-end" spacing={2}>
                      <IconButton
                        aria-label="Edit bicycle"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => openEdit(b)}
                      />
                      <IconButton
                        aria-label="Delete bicycle"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        isLoading={deletingId === b.bicycleId}
                        onClick={() => handleDelete(b.bicycleId)}
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
            {isEdit ? "Edit bicycle" : "Create bicycle"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mb={4}
              isRequired
              isInvalid={!!currentNumberError}
            >
              <FormLabel>Bicycle number</FormLabel>
              <Input
                name="bicycleNumber"
                value={form.bicycleNumber}
                onChange={handleChange}
                placeholder="e.g. 101, 202, etc."
              />
              {currentNumberError && (
                <FormErrorMessage>{currentNumberError}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">In operate</FormLabel>
              <Switch
                name="inOperate"
                isChecked={form.inOperate}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
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

export default AdminBicyclesSection;
