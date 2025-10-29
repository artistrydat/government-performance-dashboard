import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PortfolioList from '../../components/PortfolioList';
import { usePortfolios } from '../../hooks/usePortfolios';
import { useAuth } from '../../lib/auth';

// Mock the hooks
vi.mock('../../hooks/usePortfolios');
vi.mock('../../lib/auth');

const mockUsePortfolios = vi.mocked(usePortfolios);
const mockUseAuth = vi.mocked(useAuth);

// Mock Convex ID
const mockId = 'test-portfolio-id' as any;

// Helper to create mock Convex mutations with required properties
const createMockMutation = (mockFn: any) => {
  return Object.assign(mockFn, {
    withOptimisticUpdate: vi.fn(),
  });
};

describe('PortfolioList', () => {
  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'portfolio_manager' as const,
  };

  const mockPortfolios = [
    {
      _id: mockId,
      _creationTime: Date.now(),
      name: 'Test Portfolio 1',
      description: 'Test description 1',
      ownerId: 'user-123' as any,
      healthScore: 85,
      totalBudget: 100000,
      allocatedBudget: 50000,
      resourceAllocation: {
        teamMembers: 0,
        budgetUtilization: 0,
        projectCount: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      _id: 'portfolio-2' as any,
      _creationTime: Date.now(),
      name: 'Test Portfolio 2',
      description: 'Test description 2',
      ownerId: 'user-123' as any,
      healthScore: 45,
      totalBudget: 50000,
      allocatedBudget: 25000,
      resourceAllocation: {
        teamMembers: 0,
        budgetUtilization: 0,
        projectCount: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  const mockPortfoliosHook = {
    portfolios: mockPortfolios,
    isLoading: false,
    createPortfolio: createMockMutation(vi.fn()),
    updatePortfolio: createMockMutation(vi.fn()),
    deletePortfolio: createMockMutation(vi.fn()),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser, login: vi.fn(), logout: vi.fn() });
    mockUsePortfolios.mockReturnValue(mockPortfoliosHook);
  });

  it('renders portfolio list with correct data', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
    expect(screen.getByText('Manage and monitor project portfolios')).toBeInTheDocument();
    expect(screen.getByText('Test Portfolio 1')).toBeInTheDocument();
    expect(screen.getByText('Test Portfolio 2')).toBeInTheDocument();
    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
  });

  it('shows health score badges with correct colors', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Excellent health score (85) should have success badge
    const excellentBadge = screen.getByText('85%');
    expect(excellentBadge).toHaveClass('badge-success');

    // At Risk health score (45) should have error badge
    const atRiskBadge = screen.getByText('45%');
    expect(atRiskBadge).toHaveClass('badge-error');
  });

  it('shows create portfolio form when create button is clicked', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    const createButton = screen.getByText('Create Portfolio');
    fireEvent.click(createButton);

    expect(screen.getByText('Create New Portfolio')).toBeInTheDocument();
    expect(screen.getByLabelText('Portfolio Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Initial Health Score')).toBeInTheDocument();
  });

  it('creates a new portfolio when form is submitted', async () => {
    const mockCreatePortfolio = createMockMutation(vi.fn().mockResolvedValue('new-portfolio-id'));
    mockUsePortfolios.mockReturnValue({
      ...mockPortfoliosHook,
      createPortfolio: mockCreatePortfolio,
    });

    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Open create form
    fireEvent.click(screen.getByText('Create Portfolio'));

    // Fill out form
    fireEvent.change(screen.getByLabelText('Portfolio Name'), {
      target: { value: 'New Portfolio' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New portfolio description' },
    });
    fireEvent.change(screen.getByLabelText('Initial Health Score'), {
      target: { value: '90' },
    });

    // Submit form - use the submit button inside the form
    const submitButtons = screen.getAllByText('Create Portfolio');
    const formSubmitButton =
      submitButtons.find(button => button.getAttribute('type') === 'submit') || submitButtons[1]; // Fallback to second button if type attribute not found

    fireEvent.click(formSubmitButton);

    await waitFor(() => {
      expect(mockCreatePortfolio).toHaveBeenCalledWith({
        name: 'New Portfolio',
        description: 'New portfolio description',
        healthScore: 90,
        totalBudget: 0,
        allocatedBudget: 0,
        ownerId: 'user-123',
        resourceAllocation: {
          teamMembers: 0,
          budgetUtilization: 0,
          projectCount: 0,
        },
      });
    });
  });

  it('enters edit mode when edit button is clicked', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Should show edit form with current values
    expect(screen.getByDisplayValue('Test Portfolio 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('updates portfolio when save button is clicked in edit mode', async () => {
    const mockUpdatePortfolio = createMockMutation(vi.fn().mockResolvedValue(mockId));
    mockUsePortfolios.mockReturnValue({
      ...mockPortfoliosHook,
      updatePortfolio: mockUpdatePortfolio,
    });

    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Enter edit mode
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Change values
    fireEvent.change(screen.getByDisplayValue('Test Portfolio 1'), {
      target: { value: 'Updated Portfolio' },
    });
    fireEvent.change(screen.getByDisplayValue('Test description 1'), {
      target: { value: 'Updated description' },
    });

    // Save changes
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdatePortfolio).toHaveBeenCalledWith({
        portfolioId: mockId,
        name: 'Updated Portfolio',
        description: 'Updated description',
        healthScore: 85,
        ownerId: 'user-123',
        totalBudget: 100000,
        allocatedBudget: 50000,
        resourceAllocation: {
          teamMembers: 0,
          budgetUtilization: 0,
          projectCount: 0,
        },
      });
    });
  });

  it('deletes portfolio when delete button is clicked and confirmed', async () => {
    const mockDeletePortfolio = createMockMutation(vi.fn().mockResolvedValue(mockId));
    mockUsePortfolios.mockReturnValue({
      ...mockPortfoliosHook,
      deletePortfolio: mockDeletePortfolio,
    });

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeletePortfolio).toHaveBeenCalledWith({ portfolioId: mockId });
    });

    confirmSpy.mockRestore();
  });

  it('shows loading state when portfolios are loading', () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: true,
      createPortfolio: createMockMutation(vi.fn()),
      updatePortfolio: createMockMutation(vi.fn()),
      deletePortfolio: createMockMutation(vi.fn()),
    });

    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('shows empty state when no portfolios exist', () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: false,
      createPortfolio: createMockMutation(vi.fn()),
      updatePortfolio: createMockMutation(vi.fn()),
      deletePortfolio: createMockMutation(vi.fn()),
    });

    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    expect(
      screen.getByText('No portfolios found. Create your first portfolio to get started.')
    ).toBeInTheDocument();
    expect(screen.getByText('Create First Portfolio')).toBeInTheDocument();
  });

  it('handles health score color coding correctly', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Check health score text and colors
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('cancels edit mode when cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Enter edit mode
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Should exit edit mode
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Test Portfolio 1')).toBeInTheDocument();
  });

  it('cancels create form when cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <PortfolioList />
      </MemoryRouter>
    );

    // Open create form
    fireEvent.click(screen.getByText('Create Portfolio'));

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Should close create form
    expect(screen.queryByText('Create New Portfolio')).not.toBeInTheDocument();
  });
});
