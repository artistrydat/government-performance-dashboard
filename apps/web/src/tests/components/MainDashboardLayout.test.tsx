import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainDashboardLayout from '../../components/MainDashboardLayout';

describe('MainDashboardLayout', () => {
  it('renders children', () => {
    render(
      <MainDashboardLayout>
        <div data-testid="child">Content</div>
      </MainDashboardLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders sidebar for a given userRole', () => {
    render(
      <MainDashboardLayout userRole="admin">
        <div data-testid="child2" />
      </MainDashboardLayout>
    );
    // Admin-specific menu item should be present
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
