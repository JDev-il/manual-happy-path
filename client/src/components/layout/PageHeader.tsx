"use client";

import styled from "styled-components";

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.text["2xl"]};
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.content.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.text.sm};
  color: ${({ theme }) => theme.content.muted};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Header>
      <Titles>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Titles>
      {actions ? <Actions>{actions}</Actions> : null}
    </Header>
  );
}
