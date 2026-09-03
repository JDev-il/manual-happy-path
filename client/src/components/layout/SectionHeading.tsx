"use client";

import styled from "styled-components";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const Label = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.text.lg};
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.content.primary};
`;

const Hint = styled.span`
  font-size: ${({ theme }) => theme.text.xs};
  color: ${({ theme }) => theme.content.muted};
`;

export function SectionHeading({
  label,
  hint,
  action,
}: {
  label: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <Row>
      <Label>{label}</Label>
      {action ?? (hint ? <Hint>{hint}</Hint> : null)}
    </Row>
  );
}
