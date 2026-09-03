"use client";

import styled from "styled-components";

/**
 * Twelve-column dashboard bed. Children opt into a span via `<GridItem span>`;
 * every panel collapses to full width below the tablet breakpoint.
 */
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 64rem) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 48rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const GridItem = styled.div<{ $span?: number; $rowSpan?: number }>`
  grid-column: span ${({ $span = 12 }) => $span};
  grid-row: span ${({ $rowSpan = 1 }) => $rowSpan};
  min-width: 0;

  @media (max-width: 64rem) {
    grid-column: span 6;
  }

  @media (max-width: 48rem) {
    grid-column: span 1;
  }
`;
