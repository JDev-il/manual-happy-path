"use client";

import styled from "styled-components";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const Shell = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.sidebarWidth} minmax(0, 1fr);
  grid-template-rows: ${({ theme }) => theme.layout.topbarHeight} minmax(0, 1fr);
  grid-template-areas:
    "sidebar topbar"
    "sidebar main";
  min-height: 100dvh;
  background: ${({ theme }) => theme.surface.base};

  @media (max-width: 64rem) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "topbar"
      "main";
  }
`;

const SidebarSlot = styled.div`
  grid-area: sidebar;
  border-right: 1px solid ${({ theme }) => theme.border.subtle};
  background: ${({ theme }) => theme.surface.sunken};

  @media (max-width: 64rem) {
    display: none;
  }
`;

const TopBarSlot = styled.div`
  grid-area: topbar;
  border-bottom: 1px solid ${({ theme }) => theme.border.subtle};
  background: ${({ theme }) => theme.surface.base};
  position: sticky;
  top: 0;
  z-index: 20;
`;

const Main = styled.main`
  grid-area: main;
  min-width: 0;
  padding: ${({ theme }) => theme.space[5]};
  padding-bottom: ${({ theme }) => theme.space[7]};

  @media (max-width: 48rem) {
    padding: ${({ theme }) => theme.space[4]};
  }
`;

const Inner = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMax};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

/** Application frame: fixed sidebar, sticky top bar, scrolling content well. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <SidebarSlot>
        <Sidebar />
      </SidebarSlot>
      <TopBarSlot>
        <TopBar />
      </TopBarSlot>
      <Main>
        <Inner>{children}</Inner>
      </Main>
    </Shell>
  );
}
