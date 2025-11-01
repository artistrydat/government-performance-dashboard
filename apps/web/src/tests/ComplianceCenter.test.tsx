import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComplianceCenter from '../components/ComplianceCenter';

// Mock the Convex queries
const mockUseQuery = vi.fn();
vi.mock('convex/react', () => ({
  useQuery: mockUseQuery,
}));

// Mock the API
vi.mock('../../api/convex/_generated/api', () => ({
  api: {
    complianceDashboard: {
      getComplianceStatistics: { name: 'getComplianceStatistics' },
      getPortfolioCompliance: { name: 'getPortfolioCompliance' },
      getComplianceTrends: { name: 'getComplianceTrends' },
      getStandardsAdherence: { name: 'getStandardsAdherence' },
      getNonComplianceHeatmap: { name: 'getNonComplianceHeatmap' },
    },
    pmiStandards: {
      listWithCriteria: { name: 'listWithCriteria' },
    },
  },
}));

const mockComplianceData = {
  complianceStats: {
    overallCompliance: 85,
    compliantProjects: 12,
    nonCompliantProjects: 3,
    totalProjects: 15,
    standardsCoverage: 90,
    trend: 'improving',
    trendValue: 5,
  },
  portfolioCompliance: [
    {
      portfolioId: '1',
      portfolioName: 'Digital Transformation',
      complianceScore: 88,
      totalProjects: 5,
      evaluatedProjects: 5,
    },
  ],
  complianceTrends: [
    { date: '2025-10-25', complianceScore: 82 },
    { date: '2025-10-26', complianceScore: 84 },
    { date: '2025-10-27', complianceScore: 85 },
  ],
  standardsAdherence: [
    { standardId: '1', standardName: 'Scope Management', complianceRate: 88, totalEvaluations: 15 },
    { standardId: '2', standardName: 'Risk Management', complianceRate: 82, totalEvaluations: 15 },
  ],
  nonComplianceHeatmap: [
    { standardId: '1', standardName: 'Scope Management', nonCompliantProjects: 2, intensity: 0.3 },
    { standardId: '2', standardName: 'Risk Management', nonCompliantProjects: 1, intensity: 0.1 },
  ],
  standardsWithCriteria: [
    {
      _id: '1',
      name: 'Scope Management',
      description: 'Project scope definition and control',
      category: 'project',
      level: 'foundational',
      weight: 0.2,
      criteria: [
        { _id: '1-1', name: 'Scope Statement', description: 'Clear scope statement exists' },
      ],
    },
  ],
};

describe('ComplianceCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially when data is loading', () => {
    mockUseQuery.mockReturnValue(null);
    render(<ComplianceCenter />);
    // Check for loading spinner by class or other attribute since role="status" isn't set
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('renders the compliance center with data', async () => {
    mockUseQuery.mockImplementation(query => {
      if (query?.name === 'getComplianceStatistics') {
        return mockComplianceData.complianceStats;
      }
      if (query?.name === 'getPortfolioCompliance') {
        return mockComplianceData.portfolioCompliance;
      }
      if (query?.name === 'listWithCriteria') {
        return mockComplianceData.standardsWithCriteria;
      }
      return null;
    });

    render(<ComplianceCenter />);

    await waitFor(() => {
      expect(screen.getByText('Compliance Center')).toBeDefined();
    });

    expect(screen.getByText('📊 Overview')).toBeDefined();
    expect(screen.getByText('📚 Standards Library')).toBeDefined();
    expect(screen.getByText('📋 Evidence Management')).toBeDefined();
    expect(screen.getByText('📄 Report Center')).toBeDefined();
    expect(screen.getByText('📈 Analytics')).toBeDefined();
  });
});
