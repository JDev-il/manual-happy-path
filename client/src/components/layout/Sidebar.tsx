"use client";

import styled from "styled-components";
import {
  Activity,
  BellRing,
  Bot,
  BriefcaseBusiness,
  LayoutDashboard,
  LineChart,
  Newspaper,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* Navigation destinations are declared here for shape only.
   TODO(UI): swap hrefs for the real route table once ROUTING lands. */
const PRIMARY_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Markets", icon: LineChart, href: "#" },
  { label: "Watchlist", icon: Star, href: "#" },
  { label: "Portfolio", icon: BriefcaseBusiness, href: "#" },
  { label: "Screener", icon: Activity, href: "#" },
] as const;

const AI_NAV = [
  { label: "AI Insights", icon: Sparkles, href: "#" },
  { label: "Predictions", icon: Bot, href: "#" },
  { label: "Digest", icon: Newspaper, href: "#" },
  { label: "Alerts", icon: BellRing, href: "#" },
] as const;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.space[3]};
  gap: ${({ theme }) => theme.space[4]};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  height: calc(${({ theme }) => theme.layout.topbarHeight} - ${({ theme }) => theme.space[3]});
`;

const Mark = styled.span`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.accent.base};
  color: ${({ theme }) => theme.accent.content};
  font-size: ${({ theme }) => theme.text.xs};
  font-weight: 700;
`;

const BrandName = styled.span`
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.content.primary};
  letter-spacing: -0.01em;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const GroupLabel = styled.span`
  padding: 0 ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.text.xs};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.content.muted};
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.content.secondary};
  font-size: ${({ theme }) => theme.text.sm};
  text-decoration: none;
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easeOut};

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background: ${({ theme }) => theme.surface.overlay};
    color: ${({ theme }) => theme.content.primary};
  }
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

/** Primary navigation rail. Active-state resolution belongs to ROUTING. */
export function Sidebar() {
  return (
    <Nav aria-label="Primary">
      <Brand>
        <Mark>MH</Mark>
        <BrandName>Meridian</BrandName>
      </Brand>

      <Group>
        <GroupLabel>Markets</GroupLabel>
        {PRIMARY_NAV.map(({ label, icon: Icon, href }) => (
          <NavLink key={label} href={href}>
            <Icon aria-hidden />
            {label}
          </NavLink>
        ))}
      </Group>

      <Group>
        <GroupLabel>Intelligence</GroupLabel>
        {AI_NAV.map(({ label, icon: Icon, href }) => (
          <NavLink key={label} href={href}>
            <Icon aria-hidden />
            {label}
          </NavLink>
        ))}
      </Group>

      <Footer>
        <Badge tone="accent" outlined>
          <Sparkles aria-hidden style={{ width: "0.75rem", height: "0.75rem" }} />
          AI layer online
        </Badge>
        <NavLink href="#">
          <Settings aria-hidden />
          Settings
        </NavLink>
      </Footer>
    </Nav>
  );
}
