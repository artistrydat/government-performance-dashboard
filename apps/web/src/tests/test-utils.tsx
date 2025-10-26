import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  _id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'project_officer',
  department: 'IT',
  createdAt: Date.now(),
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  _id: 'project-123',
  name: 'Test Project',
  description: 'A test project',
  status: 'active',
  budget: 100000,
  timeline: {
    startDate: Date.now(),
    endDate: Date.now() + 86400000,
    milestones: [],
  },
  portfolioId: 'portfolio-123',
  ownerId: 'user-123',
  healthScore: 85,
  createdAt: Date.now(),
  ...overrides,
});

export const createMockPortfolio = (overrides = {}) => ({
  _id: 'portfolio-123',
  name: 'Test Portfolio',
  description: 'A test portfolio',
  ownerId: 'user-123',
  healthScore: 75,
  createdAt: Date.now(),
  ...overrides,
});

export const createMockRisk = (overrides = {}) => ({
  _id: 'risk-123',
  title: 'Test Risk',
  description: 'A test risk',
  severity: 'medium',
  probability: 50,
  impact: 60,
  status: 'identified',
  projectId: 'project-123',
  ownerId: 'user-123',
  mitigationPlan: 'Test mitigation plan',
  createdAt: Date.now(),
  ...overrides,
});
