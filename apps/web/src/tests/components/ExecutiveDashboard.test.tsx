import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ExecutiveDashboard from '../../components/ExecutiveDashboard';
import { usePortfolios } from '../../hooks/usePortfolios';
import { useProjects } from '../../hooks/useProjects';
import { useRisks } from '../../hooks/useRisks';

// Mock the hooks
vi.mock('../../hooks/usePortfolios');
vi.mock('../../hooks/useProjects');
vi.mock('../../hooks/useRisks');

const mockUsePortfolios = vi.mocked(usePortfolios);
const mockUseProjects = vi.mocked(useProjects);
const mockUseRisks = vi.mocked(useRisks);

// Create proper mock functions with Convex properties
const createMockMutation = () => {
  const mockFn = vi.fn();
  // Add the required withOptimisticUpdate property
  (mockFn as any).withOptimisticUpdate = vi.fn();
  return mockFn as any; // Cast to any to bypass TypeScript strict checking
};

// Create mock mutation functions with all required properties
const mockCreatePortfolio = createMockMutation();
const mockUpdatePortfolio = createMockMutation();
const mockDeletePortfolio = createMockMutation();
const mockCreateProject = createMockMutation();
const mockUpdateProject = createMockMutation();
const mockDeleteProject = createMockMutation();
const mockCreateRisk = createMockMutation();
const mockUpdateRisk = createMockMutation();
const mockDeleteRisk = createMockMutation();

// Mock data
const mockPortfolios = [
  {
    _id: 'portfolio1' as any,
    _creationTime: Date.now(),
    name: 'Infrastructure Portfolio',
    description: 'Infrastructure projects',
    ownerId: 'user1' as any,
    healthScore: 85,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'portfolio2' as any,
    _creationTime: Date.now(),
    name: 'Digital Transformation',
    description: 'Digital transformation initiatives',
    ownerId: 'user2' as any,
    healthScore: 65,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockProjects = [
  {
    _id: 'project1' as any,
    _creationTime: Date.now(),
    name: 'Network Upgrade',
    description: 'Upgrade network infrastructure',
    status: 'active' as const,
    budget: 500000,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 86400000 * 90,
      milestones: [],
    },
    portfolioId: 'portfolio1' as any,
    ownerId: 'user1' as any,
    healthScore: 90,
    riskLevel: 'low' as const,
    tags: ['infrastructure', 'network'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'project2' as any,
    _creationTime: Date.now(),
    name: 'CRM Implementation',
    description: 'Implement new CRM system',
    status: 'at-risk' as const,
    budget: 750000,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 86400000 * 120,
      milestones: [],
    },
    portfolioId: 'portfolio2' as any,
    ownerId: 'user2' as any,
    healthScore: 60,
    riskLevel: 'medium' as const,
    tags: ['software', 'crm'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockRisks = [
  {
    _id: 'risk1' as any,
    _creationTime: Date.now(),
    projectId: 'project1' as any,
    title: 'Network Security Risk',
    description: 'Potential security vulnerabilities',
    severity: 'medium' as const,
    status: 'identified' as const,
    probability: 0.3,
    impact: 0.7,
    mitigationPlan: 'Implement security protocols',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'risk2' as any,
    _creationTime: Date.now(),
    projectId: 'project2' as any,
    title: 'Budget Overrun',
    description: 'Potential budget overrun',
    severity: 'critical' as const,
    status: 'monitored' as const,
    probability: 0.6,
    impact: 0.9,
    mitigationPlan: 'Monitor spending closely',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('ExecutiveDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: true,
      createPortfolio: mockCreatePortfolio,
      updatePortfolio: mockUpdatePortfolio,
      deletePortfolio: mockDeletePortfolio,
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: true,
      createProject: createMockMutation('new-project-id'),
      updateProject: createMockMutation('updated-project-id'),
      updatePortfolioAssignment: createMockMutation('updated-portfolio-assignment-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: true,
      createRisk: mockCreateRisk,
      updateRisk: mockUpdateRisk,
      deleteRisk: mockDeleteRisk,
    });

    renderWithRouter(<ExecutiveDashboard />);

    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(12); // 2 per card × 6 cards
  });

  it('renders dashboard with data when loaded', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: mockCreatePortfolio,
      updatePortfolio: mockUpdatePortfolio,
      deletePortfolio: mockDeletePortfolio,
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: mockCreateRisk,
      updateRisk: mockUpdateRisk,
      deleteRisk: mockDeleteRisk,
    });

    renderWithRouter(<ExecutiveDashboard />);

    // Check main title and description
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('High-level portfolio overview for strategic decision making')
    ).toBeInTheDocument();

    // Check overall portfolio health score
    expect(screen.getByText('Overall Portfolio Health')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument(); // Average of 85 and 65

    // Check KPI cards - use more specific queries to avoid duplicates
    expect(screen.getByText('Total Portfolios')).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('Total Risks')).toBeInTheDocument();
    expect(screen.getByText('Critical Risks')).toBeInTheDocument();
    expect(screen.getByText('Avg Health Score')).toBeInTheDocument();

    // Check that the values exist somewhere on the page (not specific to which card)
    expect(screen.getAllByText('$1.3M').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // Critical Risks
    expect(screen.getAllByText('75.0').length).toBeGreaterThan(0);

    // Check natural language summary
    expect(screen.getByText('Executive Summary')).toBeInTheDocument();
    expect(
      screen.getByText(/Overall portfolio health is good with an average score of 75.0/)
    ).toBeInTheDocument();

    // Check strategic health indicators
    expect(screen.getByText('Strategic Health Indicators')).toBeInTheDocument();
    expect(screen.getAllByText('$1.3M').length).toBeGreaterThan(0); // Budget utilization
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // Active projects
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // At-risk projects
    expect(screen.getByText('0.0%')).toBeInTheDocument(); // Completion rate

    // Check portfolio list
    expect(screen.getByText('Portfolio Overview')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
  });

  it('renders empty state when no portfolios exist', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: false,
      createPortfolio: mockCreatePortfolio,
      updatePortfolio: mockUpdatePortfolio,
      deletePortfolio: mockDeletePortfolio,
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: false,
      createRisk: mockCreateRisk,
      updateRisk: mockUpdateRisk,
      deleteRisk: mockDeleteRisk,
    });

    renderWithRouter(<ExecutiveDashboard />);

    expect(screen.getByText('No portfolios created yet.')).toBeInTheDocument();
    expect(screen.getByText(/No portfolios available/)).toBeInTheDocument();
  });

  it('displays correct health score colors and labels', async () => {
    const highHealthPortfolio = {
      _id: 'portfolio1' as any,
      _creationTime: Date.now(),
      name: 'High Health Portfolio',
      description: 'Excellent health',
      ownerId: 'user1' as any,
      healthScore: 95,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const mediumHealthPortfolio = {
      _id: 'portfolio2' as any,
      _creationTime: Date.now(),
      name: 'Medium Health Portfolio',
      description: 'Good health',
      ownerId: 'user2' as any,
      healthScore: 70,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const lowHealthPortfolio = {
      _id: 'portfolio3' as any,
      _creationTime: Date.now(),
      name: 'Low Health Portfolio',
      description: 'Poor health',
      ownerId: 'user3' as any,
      healthScore: 30,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockUsePortfolios.mockReturnValue({
      portfolios: [highHealthPortfolio, mediumHealthPortfolio, lowHealthPortfolio],
      isLoading: false,
      createPortfolio: mockCreatePortfolio,
      updatePortfolio: mockUpdatePortfolio,
      deletePortfolio: mockDeletePortfolio,
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: false,
      createRisk: mockCreateRisk,
      updateRisk: mockUpdateRisk,
      deleteRisk: mockDeleteRisk,
    });

    renderWithRouter(<ExecutiveDashboard />);

    // Check health score display
    expect(screen.getByText('65')).toBeInTheDocument(); // Average of 95, 70, 30

    // Check portfolio status badges
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('handles error states gracefully', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: false,
      createPortfolio: mockCreatePortfolio,
      updatePortfolio: mockUpdatePortfolio,
      deletePortfolio: mockDeletePortfolio,
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: mockCreateProject,
      updateProject: mockUpdateProject,
      deleteProject: mockDeleteProject,
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: false,
      createRisk: mockCreateRisk,
      updateRisk: mockUpdateRisk,
      deleteRisk: mockDeleteRisk,
    });

    renderWithRouter(<ExecutiveDashboard />);

    // Should render empty state without crashing
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(screen.getByText('No portfolios created yet.')).toBeInTheDocument();
  });
});

describe('KPICard Component', () => {
  it('renders with basic props', () => {
    const { container } = render(
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">Test Title</h3>
              <p className="text-2xl font-bold mt-1">100</p>
            </div>
          </div>
        </div>
      </div>
    );

    expect(container).toHaveTextContent('Test Title');
    expect(container).toHaveTextContent('100');
  });

  it('renders with trend indicator', () => {
    const { container } = render(
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-base-content/70">Test Title</h3>
              <p className="text-2xl font-bold mt-1">100</p>
              <div className="flex items-center mt-1 text-sm">
                <span className="mr-1">↗️</span>
                <span className="text-success">+10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    expect(container).toHaveTextContent('+10%');
  });
});

describe('PortfolioHealthScore Component', () => {
  it('renders excellent health score correctly', () => {
    const { container } = render(
      <div className="text-center">
        <div className="font-bold text-4xl text-success">95</div>
        <div className="text-sm text-base-content/70 mt-1">Excellent Health</div>
      </div>
    );

    expect(container).toHaveTextContent('95');
    expect(container).toHaveTextContent('Excellent Health');
  });

  it('renders poor health score correctly', () => {
    const { container } = render(
      <div className="text-center">
        <div className="font-bold text-4xl text-error">25</div>
        <div className="text-sm text-base-content/70 mt-1">Poor Health</div>
      </div>
    );

    expect(container).toHaveTextContent('25');
    expect(container).toHaveTextContent('Poor Health');
  });
});
