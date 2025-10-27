import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ExecutiveRiskDashboard from '../../components/ExecutiveRiskDashboard';
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

// Create proper mock mutation functions that match Convex types
const createMockMutation = () => {
  const mutation = vi.fn() as any;
  mutation.withOptimisticUpdate = vi.fn();
  return mutation;
};

// Mock data with proper Convex types
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
    description: 'Digital initiatives',
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
      endDate: Date.now() + 86400000,
      milestones: [],
    },
    portfolioId: 'portfolio1' as any,
    ownerId: 'user1' as any,
    healthScore: 80,
    riskLevel: 'medium' as const,
    tags: ['infrastructure', 'network'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'project2' as any,
    _creationTime: Date.now(),
    name: 'Cloud Migration',
    description: 'Migrate to cloud platform',
    status: 'at-risk' as const,
    budget: 1000000,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 172800000,
      milestones: [],
    },
    portfolioId: 'portfolio2' as any,
    ownerId: 'user2' as any,
    healthScore: 60,
    riskLevel: 'high' as const,
    tags: ['cloud', 'migration'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockRisks = [
  {
    _id: 'risk1' as any,
    _creationTime: Date.now(),
    projectId: 'project1' as any,
    title: 'Network Downtime',
    description: 'Potential network downtime during upgrade',
    severity: 'high' as const,
    status: 'identified' as const,
    probability: 70,
    impact: 80,
    mitigationPlan: 'Schedule maintenance window',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'risk2' as any,
    _creationTime: Date.now(),
    projectId: 'project2' as any,
    title: 'Data Migration Failure',
    description: 'Risk of data loss during migration',
    severity: 'critical' as const,
    status: 'monitored' as const,
    probability: 40,
    impact: 95,
    mitigationPlan: 'Implement backup strategy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'risk3' as any,
    _creationTime: Date.now(),
    projectId: 'project1' as any,
    title: 'Budget Overrun',
    description: 'Potential budget overrun',
    severity: 'medium' as const,
    status: 'mitigated' as const,
    probability: 30,
    impact: 60,
    mitigationPlan: 'Monitor expenses closely',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

describe('ExecutiveRiskDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: true,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: true,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: true,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Executive Risk Dashboard')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toHaveLength(12); // 4 cards * 3 skeletons each
  });

  it('renders dashboard with data correctly', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check main title and description
    expect(screen.getByText('Executive Risk Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('Comprehensive risk overview for executive decision making')
    ).toBeInTheDocument();

    // Check that all main sections are rendered
    expect(screen.getByText('Executive Risk Summary')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Risk Heat Map')).toBeInTheDocument();
    expect(screen.getByText('Critical Risk Indicators')).toBeInTheDocument();
    expect(screen.getByText('Risk Trend Analysis')).toBeInTheDocument();

    // Check portfolio names in heat map
    await waitFor(() => {
      expect(screen.getByText('Infrastructure Portfolio')).toBeInTheDocument();
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
    });

    // Check risk indicators
    expect(screen.getByText('🚨 Critical Risks (1)')).toBeInTheDocument();
    expect(screen.getByText('⚠️ High Risks (1)')).toBeInTheDocument();
  });

  it('displays correct risk levels in heat map', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that portfolio with critical risk shows badges
    await waitFor(() => {
      const criticalBadges = screen.getAllByText('Critical');
      expect(criticalBadges.length).toBeGreaterThan(0);

      const highBadges = screen.getAllByText('High');
      expect(highBadges.length).toBeGreaterThan(0);
    });

    // Check risk breakdown labels are present - use getAllByText since there are multiple instances
    const criticalLabels = screen.getAllByText('Critical:');
    expect(criticalLabels.length).toBeGreaterThan(0);
    const highLabels = screen.getAllByText('High:');
    expect(highLabels.length).toBeGreaterThan(0);
    const mediumLabels = screen.getAllByText('Medium:');
    expect(mediumLabels.length).toBeGreaterThan(0);
    const lowLabels = screen.getAllByText('Low:');
    expect(lowLabels.length).toBeGreaterThan(0);
  });

  it('shows no risks message when no risks exist', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that no critical/high risks message is shown
    await waitFor(() => {
      expect(
        screen.getByText('No critical or high-priority risks identified.')
      ).toBeInTheDocument();
    });

    // Check that trend analysis shows zero risks
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0); // Multiple zeros for different metrics
  });

  it('displays actionable recommendations correctly', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that actionable recommendations section exists
    await waitFor(() => {
      expect(screen.getByText('Actionable Recommendations')).toBeInTheDocument();
    });

    // Check for specific recommendations
    expect(screen.getByText(/Schedule immediate executive review/i)).toBeInTheDocument();
    expect(screen.getByText(/Allocate additional resources/i)).toBeInTheDocument();
  });

  it('handles empty portfolios gracefully', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: [],
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: [],
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that empty state is handled
    await waitFor(() => {
      expect(screen.getByText('No portfolios available.')).toBeInTheDocument();
    });
  });

  it('displays risk escalation status correctly', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that escalation status badges are shown
    await waitFor(() => {
      expect(screen.getByText('Needs Escalation')).toBeInTheDocument();
      expect(screen.getByText('Under Review')).toBeInTheDocument();
    });
  });

  it('calculates and displays risk trends correctly', async () => {
    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation(),
      updatePortfolio: createMockMutation(),
      deletePortfolio: createMockMutation(),
    });

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation(),
      updateProject: createMockMutation(),
      deleteProject: createMockMutation(),
    });

    mockUseRisks.mockReturnValue({
      risks: mockRisks,
      isLoading: false,
      createRisk: createMockMutation(),
      updateRisk: createMockMutation(),
      deleteRisk: createMockMutation(),
    });

    render(
      <MemoryRouter>
        <ExecutiveRiskDashboard />
      </MemoryRouter>
    );

    // Check that trend analysis section exists
    await waitFor(() => {
      expect(screen.getByText('Risk Trend Analysis')).toBeInTheDocument();
    });

    // Check that average risk score is displayed
    expect(screen.getByText(/Average Risk Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Risk Concentration:/)).toBeInTheDocument();
    expect(screen.getByText(/Overall Risk Trend:/)).toBeInTheDocument();
  });
});
