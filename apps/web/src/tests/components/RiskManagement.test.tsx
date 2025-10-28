import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RiskManagement from '../../components/RiskManagement';
import { useRisks } from '../../hooks/useRisks';
import { useProjects } from '../../hooks/useProjects';

// Mock the hooks
vi.mock('../../hooks/useRisks', () => ({
  useRisks: vi.fn(),
}));

vi.mock('../../hooks/useProjects', () => ({
  useProjects: vi.fn(),
}));

const mockRisks = [
  {
    _id: 'risk1' as any,
    projectId: 'project1' as any,
    title: 'Budget Overrun Risk',
    description: 'Potential budget overrun due to scope creep',
    severity: 'high' as const,
    status: 'identified' as const,
    probability: 70,
    impact: 80,
    mitigationPlan: 'Implement strict change control process',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'risk2' as any,
    projectId: 'project2' as any,
    title: 'Resource Shortage',
    description: 'Potential shortage of skilled developers',
    severity: 'medium' as const,
    status: 'monitored' as const,
    probability: 50,
    impact: 60,
    mitigationPlan: 'Cross-train team members',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'risk3' as any,
    projectId: 'project1' as any,
    title: 'Security Vulnerability',
    description: 'Potential security vulnerability in authentication',
    severity: 'critical' as const,
    status: 'mitigated' as const,
    probability: 30,
    impact: 90,
    mitigationPlan: 'Implement multi-factor authentication',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockProjects = [
  {
    _id: 'project1' as any,
    name: 'Government Portal',
    description: 'Public government services portal',
    status: 'active' as const,
    healthScore: 85,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'project2' as any,
    name: 'Mobile App',
    description: 'Mobile application for citizens',
    status: 'active' as const,
    healthScore: 75,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockUseRisks = {
  risks: mockRisks,
  isLoading: false,
  createRisk: vi.fn(),
  updateRisk: vi.fn(),
  deleteRisk: vi.fn(),
};

const mockUseProjects = {
  projects: mockProjects,
  isLoading: false,
};

describe('RiskManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRisks as any).mockReturnValue(mockUseRisks);
    (useProjects as any).mockReturnValue(mockUseProjects);
  });

  it('renders the risk management dashboard with correct title', () => {
    render(<RiskManagement />);
    expect(screen.getByText('Risk Management')).toBeInTheDocument();
  });

  it('displays risk statistics correctly', () => {
    render(<RiskManagement />);
    expect(screen.getByText('Total Risks')).toBeInTheDocument();

    // Use getAllByText for values that appear multiple times and check specific positions
    const totalRisksElements = screen.getAllByText('3');
    expect(totalRisksElements.length).toBeGreaterThan(0);

    const highPriorityElements = screen.getAllByText('2');
    expect(highPriorityElements.length).toBeGreaterThan(0);

    const activeRisksElements = screen.getAllByText('3'); // All 3 risks are active (not resolved)
    expect(activeRisksElements.length).toBeGreaterThan(0);

    const resolvedElements = screen.getAllByText('0');
    expect(resolvedElements.length).toBeGreaterThan(0);
  });

  it('displays risk list with correct columns', () => {
    render(<RiskManagement />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Probability')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays all risks in the table', () => {
    render(<RiskManagement />);
    expect(screen.getByText('Budget Overrun Risk')).toBeInTheDocument();
    expect(screen.getByText('Resource Shortage')).toBeInTheDocument();
    expect(screen.getByText('Security Vulnerability')).toBeInTheDocument();
  });

  it('shows severity badges with correct colors', () => {
    render(<RiskManagement />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('shows status badges with correct labels', () => {
    render(<RiskManagement />);
    expect(screen.getByText('IDENTIFIED')).toBeInTheDocument();
    expect(screen.getByText('MONITORED')).toBeInTheDocument();
    expect(screen.getByText('MITIGATED')).toBeInTheDocument();
  });

  it('calculates and displays risk scores correctly', () => {
    render(<RiskManagement />);
    // Risk 1: (70 * 80) / 100 = 56.0
    expect(screen.getAllByText('56.0').length).toBeGreaterThan(0);
    // Risk 2: (50 * 60) / 100 = 30.0
    expect(screen.getAllByText('30.0').length).toBeGreaterThan(0);
    // Risk 3: (30 * 90) / 100 = 27.0
    expect(screen.getAllByText('27.0').length).toBeGreaterThan(0);
  });

  it('filters risks by severity', () => {
    render(<RiskManagement />);

    const severityFilter = screen.getByLabelText('Filter by Severity');
    fireEvent.change(severityFilter, { target: { value: 'high' } });

    expect(screen.getByText('Budget Overrun Risk')).toBeInTheDocument();
    expect(screen.queryByText('Resource Shortage')).not.toBeInTheDocument();
    expect(screen.queryByText('Security Vulnerability')).not.toBeInTheDocument();
  });

  it('filters risks by status', () => {
    render(<RiskManagement />);

    const statusFilter = screen.getByLabelText('Filter by Status');
    fireEvent.change(statusFilter, { target: { value: 'identified' } });

    expect(screen.getByText('Budget Overrun Risk')).toBeInTheDocument();
    expect(screen.queryByText('Resource Shortage')).not.toBeInTheDocument();
    expect(screen.queryByText('Security Vulnerability')).not.toBeInTheDocument();
  });

  it('filters risks by project', () => {
    render(<RiskManagement />);

    const projectFilter = screen.getByLabelText('Filter by Project');
    fireEvent.change(projectFilter, { target: { value: 'project1' } });

    expect(screen.getByText('Budget Overrun Risk')).toBeInTheDocument();
    expect(screen.getByText('Security Vulnerability')).toBeInTheDocument();
    expect(screen.queryByText('Resource Shortage')).not.toBeInTheDocument();
  });

  it('opens create risk modal when create button is clicked', () => {
    render(<RiskManagement />);

    const createButton = screen.getByRole('button', { name: 'Create New Risk' });
    fireEvent.click(createButton);

    expect(screen.getByRole('heading', { name: 'Create New Risk' })).toBeInTheDocument();
    expect(screen.getByLabelText('Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Risk Title')).toBeInTheDocument();
  });

  it('creates a new risk when form is submitted', async () => {
    render(<RiskManagement />);

    const createButton = screen.getByRole('button', { name: 'Create New Risk' });
    fireEvent.click(createButton);

    // Fill out the form
    const projectSelect = screen.getByLabelText('Project');
    fireEvent.change(projectSelect, { target: { value: 'project1' } });

    const titleInput = screen.getByLabelText('Risk Title');
    fireEvent.change(titleInput, { target: { value: 'New Test Risk' } });

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    // Use getAllByRole and select the submit button (last one in the array)
    const submitButtons = screen.getAllByRole('button', { name: 'Create New Risk' });
    const submitButton = submitButtons[submitButtons.length - 1]; // Last one is the modal submit
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseRisks.createRisk).toHaveBeenCalledWith({
        projectId: 'project1',
        title: 'New Test Risk',
        description: 'Test description',
        severity: 'medium',
        status: 'identified',
        probability: 50,
        impact: 50,
        mitigationPlan: '',
      });
    });
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<RiskManagement />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Risk')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Budget Overrun Risk')).toBeInTheDocument();
  });

  it('updates risk when edit form is submitted', async () => {
    render(<RiskManagement />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    const titleInput = screen.getByLabelText('Risk Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Risk Title' } });

    const submitButton = screen.getByText('Update Risk');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseRisks.updateRisk).toHaveBeenCalled();
    });
  });

  it('deletes risk when delete button is clicked and confirmed', async () => {
    window.confirm = vi.fn(() => true);
    render(<RiskManagement />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this risk?');
    expect(mockUseRisks.deleteRisk).toHaveBeenCalledWith({ riskId: 'risk1' });
  });

  it('escalates high and critical risks', () => {
    window.alert = vi.fn();
    render(<RiskManagement />);

    const escalateButtons = screen.getAllByText('Escalate');

    // First risk is high severity - should be escalatable
    fireEvent.click(escalateButtons[0]);
    expect(window.alert).toHaveBeenCalledWith(
      'Risk "Budget Overrun Risk" has been escalated to portfolio management for review.'
    );

    // Third risk is critical severity - should be escalatable
    fireEvent.click(escalateButtons[2]);
    expect(window.alert).toHaveBeenCalledWith(
      'Risk "Security Vulnerability" has been escalated to portfolio management for review.'
    );
  });

  it('prevents escalation of low and medium risks', () => {
    render(<RiskManagement />);

    const escalateButtons = screen.getAllByText('Escalate');

    // Second risk is medium severity - should be disabled
    expect(escalateButtons[1]).toBeDisabled();
  });

  it('displays loading state when data is loading', () => {
    (useRisks as any).mockReturnValue({ ...mockUseRisks, isLoading: true });
    render(<RiskManagement />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('displays empty state when no risks match filters', () => {
    render(<RiskManagement />);

    const severityFilter = screen.getByLabelText('Filter by Severity');
    fireEvent.change(severityFilter, { target: { value: 'low' } });

    expect(screen.getByText('No risks found matching your filters.')).toBeInTheDocument();
  });

  it('handles risk score calculation correctly', () => {
    render(<RiskManagement />);

    expect(screen.getAllByText('56.0').length).toBeGreaterThan(0);
    expect(screen.getAllByText('30.0').length).toBeGreaterThan(0);
    expect(screen.getAllByText('27.0').length).toBeGreaterThan(0);
  });

  it('shows project names in risk table', () => {
    render(<RiskManagement />);

    // Use getAllByText since project names might appear multiple times
    const govPortalElements = screen.getAllByText('Government Portal');
    expect(govPortalElements.length).toBeGreaterThan(0);

    const mobileAppElements = screen.getAllByText('Mobile App');
    expect(mobileAppElements.length).toBeGreaterThan(0);
  });

  it('handles missing project gracefully', () => {
    const risksWithMissingProject = [
      {
        ...mockRisks[0],
        projectId: 'nonexistent' as any,
      },
    ];

    (useRisks as any).mockReturnValue({ ...mockUseRisks, risks: risksWithMissingProject });
    render(<RiskManagement />);

    expect(screen.getByText('Unknown Project')).toBeInTheDocument();
  });
});
