import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";

type Role = "admin" | "employee" | "unknown";

export interface DashboardNavItem {
  label: string;
  targetId?: string;
  to?: string;
}

interface DashboardLayoutProps {
  title: string;
  navItems?: DashboardNavItem[];
  roleOverride?: Role;
  children: ReactNode;
}

interface MeResponse { id: number; username: string; role: string }

async function fetchMe(): Promise<MeResponse> {
  const res = await axiosInstance.get<MeResponse>("/auth/me");
  return res.data;
}

// Centralized styling
const DASHBOARD_THEME = {
  appName: "Go-card management system",
  pageBg: "gray.100",
  headerBg: "gray.600",
  headerText: "white",
  subText: "whiteAlpha.800",
  contentPadding: 6,
};

const NAV_BUTTON_BASE = {
  size: "sm" as const,
  variant: "solid" as const,
  bg: "whiteAlpha.200",
  color: "white",
  border: "1px solid",
  borderColor: "whiteAlpha.400",
  _hover: { bg: "whiteAlpha.300" },
  _active: { bg: "whiteAlpha.400" },
};

const NAV_BUTTON_ACTIVE = {
  bg: "white",
  color: "gray.800",
  borderColor: "white",
  _hover: { bg: "whiteAlpha.900" },
};

const DashboardLayout = ({
  title,
  navItems = [],
  roleOverride,
  children,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Fetch authenticated user (cookie-based)
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    // ProtectedRoute already blocks unauthorized pages,
    // so this just lets us show role label in header.
    staleTime: 60_000,
  });

  const role = useMemo<Role>(() => {
    if (roleOverride) return roleOverride;
    const r = me?.role?.toLowerCase();
    if (r === "admin") return "admin";
    if (r === "employee") return "employee";
    return "unknown";
  }, [roleOverride, me?.role]);

  const roleLabel = useMemo(() => {
    if (role === "admin") return "Admin";
    if (role === "employee") return "Employee";
    return "Dashboard";
  }, [role]);

  const firstSectionId = navItems.find((n) => n.targetId)?.targetId ?? null;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    firstSectionId
  );

  useEffect(() => {
    setActiveSectionId((prev) => prev ?? firstSectionId);

    const sectionItems = navItems.filter((n) => n.targetId);
    if (!sectionItems.length) return;

    const elements = sectionItems
      .map((n) => (n.targetId ? document.getElementById(n.targetId) : null))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActiveSectionId(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navItems, firstSectionId]);

  const handleLogout = async () => {
    try {
      // Clear cookie server-side (recommended)
      await axiosInstance.post("/auth/sign-out");
    } catch {
      // even if it fails, still clear client cache + navigate away
    } finally {
      queryClient.clear();
      navigate("/", { replace: true });
    }
  };

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(targetId);
    }
  };

  return (
    <Flex direction="column" minHeight="100vh" bg={DASHBOARD_THEME.pageBg}>
      <Flex
        justify="space-between"
        align="center"
        bg={DASHBOARD_THEME.headerBg}
        color={DASHBOARD_THEME.headerText}
        px={6}
        py={4}
        gap={4}
        wrap="wrap"
      >
        <Box>
          <Heading size="sm" opacity={0.95}>
            {DASHBOARD_THEME.appName}
          </Heading>
          <Heading size="md">{title}</Heading>
          <Text fontSize="sm" color={DASHBOARD_THEME.subText}>
            {roleLabel}
          </Text>
        </Box>

        {navItems.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {navItems.map((item) => {
              const isActive = item.to
                ? location.pathname === item.to
                : item.targetId === activeSectionId;

              const onClick = () => {
                if (item.to) navigate(item.to);
                else if (item.targetId) handleScrollTo(item.targetId);
              };

              return (
                <Button
                  key={item.to ?? item.targetId ?? item.label}
                  {...NAV_BUTTON_BASE}
                  {...(isActive ? NAV_BUTTON_ACTIVE : {})}
                  onClick={onClick}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </Button>
              );
            })}
          </HStack>
        )}

        <Button bgColor="#BF565A" size="sm" onClick={() => void handleLogout()}>
          Logout
        </Button>
      </Flex>

      <Box flex="1" p={DASHBOARD_THEME.contentPadding}>
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
