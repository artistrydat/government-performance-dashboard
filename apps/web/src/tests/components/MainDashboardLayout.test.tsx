import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MainDashboardLayout from '../../components/MainDashboardLayout';

// Mock the auth hook
vi.mock('../../lib/auth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'admin' },
    logout: vi.fn(),
  }),
}));

describe('MainDashboardLayout', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <MainDashboardLayout>
          <div data-testid="child">Content</div>
        </MainDashboardLayout>
      </MemoryRouter>
    );
    // Children should be rendered in both mobile and desktop layouts
    expect(screen.getAllByTestId('child').length).toBeGreaterThan(0);
  });

  it('renders sidebar for a given userRole', () => {
    render(
      <MemoryRouter>
        <MainDashboardLayout userRole="admin">
          <div data-testid="child2" />
        </MainDashboardLayout>
      </MemoryRouter>
    );
    // Admin-specific menu item should be present
    expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
  });

  it('renders breadcrumb navigation', () => {
    render(
      <MemoryRouter>
        <MainDashboardLayout currentPath="/dashboard">
          <div data-testid="child3" />
        </MainDashboardLayout>
      </MemoryRouter>
    );
    // Breadcrumb navigation should be present
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('renders mobile menu button', () => {
    render(
      <MemoryRouter>
        <MainDashboardLayout>
          <div data-testid="child4" />
        </MainDashboardLayout>
      </MemoryRouter>
    );
    // The mobile menu button should be present (it's a label that acts as a button)
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });
});
