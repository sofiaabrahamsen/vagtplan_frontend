import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ClockMode } from "../../hooks/useShifts";

interface Props {
  mode: ClockMode; // "in" | "out" | "unavailable"
  loading?: boolean;
  error?: string | null;
  onClockIn: () => Promise<void>;
  onClockOut: () => Promise<void>;
}

const STORAGE_KEY = "clockInStartedAt";

const formatElapsed = (ms: number) => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const ClockInOutSection = ({
  mode,
  loading = false,
  error = null,
  onClockIn,
  onClockOut,
}: Props) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  // We store the local "clock in" moment
  const [startIso, setStartIso] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  // Timer display string
  const [elapsedLabel, setElapsedLabel] = useState("00:00:00");

  const intervalRef = useRef<number | null>(null);

  const badge = useMemo(() => {
    if (mode === "out") return { label: "Active", scheme: "green" as const };
    if (mode === "in") return { label: "Ready", scheme: "blue" as const };
    return { label: "Unavailable", scheme: "gray" as const };
  }, [mode]);

  // Start/stop timer when mode or startIso changes
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only run timer if we're "active"
    if (mode !== "out") {
      setElapsedLabel("00:00:00");
      return;
    }

    // If we're active but have no stored start time,
    // set a fallback start time NOW (best effort UX)
    let effectiveStartIso = startIso;
    if (!effectiveStartIso) {
      effectiveStartIso = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, effectiveStartIso);
      setStartIso(effectiveStartIso);
    }

    const update = () => {
      const start = new Date(effectiveStartIso!).getTime();
      const now = Date.now();
      setElapsedLabel(formatElapsed(now - start));
    };

    update();
    intervalRef.current = window.setInterval(update, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mode, startIso]);

  const handleClick = async () => {
    setBusy(true);
    try {
      if (mode === "in") {
        await onClockIn();

        const iso = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, iso);
        setStartIso(iso);

        toast({
          title: "Clocked in",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }

      if (mode === "out") {
        await onClockOut();

        localStorage.removeItem(STORAGE_KEY);
        setStartIso(null);
        setElapsedLabel("00:00:00");

        toast({
          title: "Clocked out",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (e: any) {
      toast({
        title: "Action failed",
        description: e?.message ?? "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      p={6}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      shadow="sm"
    >
      <HStack justify="space-between" align="center" mb={3}>
        <Heading size="md" color="gray.700">
          Clock in / out
        </Heading>

        <Badge colorScheme={badge.scheme} variant="subtle">
          {badge.label}
        </Badge>
      </HStack>

      <Divider mb={4} />

      {error && (
        <Text fontSize="sm" color="red.500" mb={3}>
          {error}
        </Text>
      )}

      <VStack align="start" spacing={2} mb={4}>
        <Text fontSize="sm" color="gray.600">
          {mode === "out"
            ? "You are currently clocked in."
            : mode === "in"
            ? "You can clock in to today’s shift."
            : "No shift available for clocking in today."}
        </Text>

        {/* ✅ Live timer when active */}
        {mode === "out" && (
          <Box
            px={3}
            py={2}
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
          >
            <Text fontSize="xs" color="gray.500">
              Worked so far
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              {elapsedLabel}
            </Text>
          </Box>
        )}
      </VStack>

      <Button
        width={{ base: "100%", md: "auto" }}
        colorScheme={mode === "out" ? "red" : "green"}
        onClick={handleClick}
        isLoading={busy || loading}
        isDisabled={mode === "unavailable" || !!error}
      >
        {mode === "out" ? "Clock out" : "Clock in"}
      </Button>
    </Box>
  );
};

export default ClockInOutSection;
