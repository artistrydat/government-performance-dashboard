import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectList from '../../components/ProjectList';
import { useProjects, useProject } from '../../hooks/useProjects';
import { usePortfolios } from '../../hooks/usePortfolios';
import { useUsers } from '../../hooks/useUsers';

// Mock the hooks
vi.mock('../../hooks/useProjects');
vi.mock('../../hooks/usePortfolios');
vi.mock('../../hooks/useUsers');

const mockUseProjects = vi.mocked(useProjects);
const mockUseProject = vi.mocked(useProject);
const mockUsePortfolios = vi.mocked(usePortfolios);
const mockUseUsers = vi.mocked(useUsers);

// Helper function to create proper Convex mutation mocks
const createMockMutation = (result: string) => {
  const mockFn = vi.fn().mockResolvedValue(result);
  return Object.assign(mockFn, {
    withOptimisticUpdate: vi.fn().mockReturnValue(mockFn),
  });
};

// Mock data
const mockProjects = [
  {
    _id: 'project1' as any,
    _creationTime: Date.now(),
    name: 'Test Project 1',
    description: 'Test project description 1',
    status: 'active' as const,
    budget: 100000,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      milestones: [
        { name: 'Milestone 1', date: Date.now() + 7 * 24 * 60 * 60 * 1000, status: 'pending' },
      ],
    },
    portfolioId: 'portfolio1' as any,
    ownerId: 'user1' as any,
    healthScore: 85,
    riskLevel: 'medium' as const,
    tags: ['frontend', 'react'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: 'project2' as any,
    _creationTime: Date.now(),
    name: 'Test Project 2',
    description: 'Test project description 2',
    status: 'planned' as const,
    budget: 50000,
    timeline: {
      startDate: Date.now(),
      endDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
      milestones: [],
    },
    portfolioId: undefined,
    ownerId: undefined,
    healthScore: 95,
    riskLevel: 'low' as const,
    tags: ['backend', 'api'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockPortfolios = [
  {
    _id: 'portfolio1' as any,
    _creationTime: Date.now(),
    name: 'Test Portfolio',
    description: 'Test portfolio description',
    ownerId: 'user1' as any,
    healthScore: 80,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockUsers = [
  {
    _id: 'user1' as any,
    _creationTime: Date.now(),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'project_officer' as const,
    department: 'Engineering',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

describe('ProjectList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation('new-project-id'),
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    mockUseProject.mockReturnValue({
      project: null,
      isLoading: false,
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    mockUsePortfolios.mockReturnValue({
      portfolios: mockPortfolios,
      isLoading: false,
      createPortfolio: createMockMutation('new-portfolio-id'),
      updatePortfolio: createMockMutation('updated-portfolio-id'),
      deletePortfolio: createMockMutation('deleted-portfolio-id'),
    });

    mockUseUsers.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      createUser: createMockMutation('new-user-id'),
      updateUser: createMockMutation('updated-user-id'),
      deleteUser: createMockMutation('deleted-user-id'),
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>
    );
  };

  it('renders project list with correct data', () => {
    renderComponent();

    expect(screen.getByText('Project Management')).toBeInTheDocument();
    expect(screen.getByText('Manage individual projects and track progress')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('Test project description 1')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('displays loading state when projects are loading', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: true,
      createProject: createMockMutation('new-project-id'),
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    renderComponent();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays empty state when no projects exist', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: createMockMutation('new-project-id'),
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    renderComponent();

    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(screen.getByText('Create your first project to get started')).toBeInTheDocument();
  });

  it('opens create project modal when create button is clicked', () => {
    renderComponent();

    // Use getAllByText and select the button (first element)
    const createButtons = screen.getAllByText('Create New Project');
    const createButton = createButtons[0]; // The button, not the modal title
    fireEvent.click(createButton);

    // Check for modal title specifically
    expect(screen.getByRole('heading', { name: 'Create New Project' })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('creates a new project when form is submitted', async () => {
    const mockCreateProject = createMockMutation('new-project-id');
    mockUseProjects.mockReturnValue({
      projects: [],
      isLoading: false,
      createProject: mockCreateProject,
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    renderComponent();

    // Open create modal
    const createButtons = screen.getAllByText('Create New Project');
    fireEvent.click(createButtons[0]);

    // Fill form using labels instead of placeholder text
    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: 'New Test Project' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'New project description' },
    });
    fireEvent.change(screen.getByLabelText(/budget/i), {
      target: { value: '75000' },
    });
    fireEvent.change(screen.getByLabelText(/health score/i), {
      target: { value: '90' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Project'));

    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: 'New Test Project',
        description: 'New project description',
        status: 'planned',
        budget: 75000,
        timeline: {
          startDate: expect.any(Number),
          endDate: expect.any(Number),
          milestones: [],
        },
        portfolioId: undefined,
        ownerId: undefined,
        healthScore: 90,
        riskLevel: 'low',
        tags: [],
      });
    });
  });

  it('opens project details when view details button is clicked', () => {
    mockUseProject.mockReturnValue({
      project: mockProjects[0],
      isLoading: false,
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: createMockMutation('deleted-project-id'),
    });

    renderComponent();

    const viewDetailsButtons = screen.getAllByText('View Details');
    fireEvent.click(viewDetailsButtons[0]);

    expect(screen.getByText('Project Details')).toBeInTheDocument();
    // Use more specific queries to avoid multiple matches
    expect(screen.getByRole('heading', { name: 'Project Details' })).toBeInTheDocument();
    // Use getAllByText and check that at least one exists
    const descriptions = screen.getAllByText('Test project description 1');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('opens edit project modal when edit button is clicked', () => {
    renderComponent();

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Project 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test project description 1')).toBeInTheDocument();
  });

  it('deletes project when delete button is clicked and confirmed', async () => {
    const mockDeleteProject = createMockMutation('deleted-project-id');
    mockUseProjects.mockReturnValue({
      projects: mockProjects,
      isLoading: false,
      createProject: createMockMutation('new-project-id'),
      updateProject: createMockMutation('updated-project-id'),
      deleteProject: mockDeleteProject,
    });

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    renderComponent();

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteProject).toHaveBeenCalledWith({ projectId: 'project1' });
    });

    confirmSpy.mockRestore();
  });

  it('displays correct status badges', () => {
    renderComponent();

    expect(screen.getByText('active')).toHaveClass('badge-success');
    expect(screen.getByText('planned')).toHaveClass('badge-info');
  });

  it('displays correct risk level badges', () => {
    renderComponent();

    expect(screen.getByText('medium')).toHaveClass('badge-warning');
    expect(screen.getByText('low')).toHaveClass('badge-success');
  });

  it('displays health scores with correct colors', () => {
    renderComponent();

    const healthScore85 = screen.getByText('85%');
    const healthScore95 = screen.getByText('95%');

    expect(healthScore85).toHaveClass('text-success');
    expect(healthScore95).toHaveClass('text-success');
  });

  it('displays portfolio information when available', () => {
    renderComponent();

    expect(screen.getByText('Test Portfolio')).toBeInTheDocument();
  });

  it('displays tags when available', () => {
    renderComponent();

    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('api')).toBeInTheDocument();
  });

  it('handles milestone addition in create form', () => {
    renderComponent();

    // Open create modal
    const createButtons = screen.getAllByText('Create New Project');
    fireEvent.click(createButtons[0]);

    // Add milestone
    const milestoneInput = screen.getByPlaceholderText('Milestone name');
    fireEvent.change(milestoneInput, { target: { value: 'New Milestone' } });

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    // Check that the milestone was added (this would appear in the milestone list)
    expect(screen.getByDisplayValue('New Milestone')).toBeInTheDocument();
  });

  it('handles tag addition in create form', () => {
    renderComponent();

    // Open create modal
    const createButtons = screen.getAllByText('Create New Project');
    fireEvent.click(createButtons[0]);

    // Add tag
    const tagInput = screen.getByPlaceholderText('Add tag');
    fireEvent.change(tagInput, { target: { value: 'new-tag' } });

    const addTagButton = screen.getByText('Add Tag');
    fireEvent.click(addTagButton);

    // Check that the tag was added (this would appear in the tag list)
    expect(screen.getByDisplayValue('new-tag')).toBeInTheDocument();
  });

  it('validates required fields in create form', () => {
    renderComponent();

    // Open create modal
    const createButtons = screen.getAllByText('Create New Project');
    fireEvent.click(createButtons[0]);

    // Try to submit without required fields
    const submitButton = screen.getByText('Create Project');
    fireEvent.click(submitButton);

    // Form should not submit and required fields should show validation
    const nameInput = screen.getByLabelText(/project name/i);
    expect(nameInput).toBeRequired();
  });
});
