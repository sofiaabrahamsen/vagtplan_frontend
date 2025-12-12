// src/components/DashboardLayout.tsx
import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type Role = "admin" | "employee" | "unknown";

export interface DashboardNavItem {
  label: string;
  /**
   * If set, clicking scrolls to this element id on the page.
   */
  targetId?: string;
  /**
   * If set, clicking navigates to this route using react-router.
   */
  to?: string;
}

interface DashboardLayoutProps {
  title: string;
  navItems?: DashboardNavItem[];
  roleOverride?: Role;
  children: ReactNode;
}

// Centralized styling for both admin + employee dashboards
const DASHBOARD_THEME = {
  appName: "Go-card management system",
  pageBg: "gray.100",
  headerBg: "gray.600", // matches LoginPage vibe
  headerText: "white",
  subText: "whiteAlpha.800",
  contentPadding: 6,
};

// Centralized nav button styling (change once → updates everywhere)
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

// Additional style when a section is active/in view
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

  // Only care about items that actually scroll (have targetId)
  const firstSectionId =
    navItems.find((n) => n.targetId)?.targetId ?? null;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    firstSectionId
  );

  const role = useMemo<Role>(() => {
    if (roleOverride) return roleOverride;

    const token = localStorage.getItem("token");
    if (!token) return "unknown";

    try {
      const decoded = jwtDecode<{ role?: string }>(token);
      const r = decoded.role?.toLowerCase();
      if (r === "admin") return "admin";
      if (r === "employee") return "employee";
      return "unknown";
    } catch {
      return "unknown";
    }
  }, [roleOverride]);

  const roleLabel = useMemo(() => {
    if (role === "admin") return "Admin side";
    if (role === "employee") return "Employee side";
    return "Dashboard";
  }, [role]);

  useEffect(() => {
    // Ensure initial active id is valid when navItems changes
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
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );

        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id);
        }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
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
      {/* Header */}
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

        {/* Optional in-page navigation / route navigation */}
        {navItems.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {navItems.map((item) => {
              const isRouteItem = !!item.to;
              // TODO - Delte ? const isScrollItem = !!item.targetId;

              const isActive = isRouteItem
                ? location.pathname === item.to
                : item.targetId === activeSectionId;

              const onClick = () => {
                if (item.to) {
                  navigate(item.to);
                } else if (item.targetId) {
                  handleScrollTo(item.targetId);
                }
              };

              return (
                <Button
                  key={item.targetId ?? item.label}
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

        <Button bgColor="#BF565A" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      {/* Main Content */}
      <Box flex="1" p={DASHBOARD_THEME.contentPadding}>
        {children}
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
