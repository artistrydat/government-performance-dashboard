import { UserRole, useAuth } from './auth';

// Permission levels for role hierarchy
export const ROLE_PERMISSIONS = {
  executive: 3,
  portfolio_manager: 2,
  project_officer: 1,
} as const;

// Check if user has required role or higher
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_PERMISSIONS[userRole] >= ROLE_PERMISSIONS[requiredRole];
};

// Check if user can access a specific resource
export const canAccessResource = (
  userRole: UserRole,
  resourceType: 'project' | 'portfolio' | 'dashboard' | 'admin',
  action: 'view' | 'edit' | 'delete' | 'create'
): boolean => {
  const permissions: Record<string, Record<string, UserRole[]>> = {
    project: {
      view: ['project_officer', 'portfolio_manager', 'executive'],
      edit: ['project_officer', 'portfolio_manager', 'executive'],
      delete: ['portfolio_manager', 'executive'],
      create: ['portfolio_manager', 'executive'],
    },
    portfolio: {
      view: ['portfolio_manager', 'executive'],
      edit: ['portfolio_manager', 'executive'],
      delete: ['executive'],
      create: ['executive'],
    },
    dashboard: {
      view: ['project_officer', 'portfolio_manager', 'executive'],
      edit: ['portfolio_manager', 'executive'],
      delete: ['executive'],
      create: ['executive'],
    },
    admin: {
      view: ['executive'],
      edit: ['executive'],
      delete: ['executive'],
      create: ['executive'],
    },
  };

  const allowedRoles = permissions[resourceType]?.[action] || [];
  return allowedRoles.includes(userRole);
};

// Check if user can view specific project data
export const canViewProject = (
  userRole: UserRole,
  projectOwnerId?: string,
  userId?: string
): boolean => {
  // Executives can view all projects
  if (userRole === 'executive') return true;

  // Portfolio managers can view projects in their portfolios
  if (userRole === 'portfolio_manager') return true;

  // Project officers can only view their own projects
  if (userRole === 'project_officer') {
    return projectOwnerId === userId && !!projectOwnerId && !!userId;
  }

  return false;
};

// Check if user can edit specific project data
export const canEditProject = (
  userRole: UserRole,
  projectOwnerId?: string,
  userId?: string
): boolean => {
  // Executives can edit all projects
  if (userRole === 'executive') return true;

  // Portfolio managers can edit projects in their portfolios
  if (userRole === 'portfolio_manager') return true;

  // Project officers can only edit their own projects
  if (userRole === 'project_officer') {
    return projectOwnerId === userId && !!projectOwnerId && !!userId;
  }

  return false;
};

// Check if user can view portfolio data
export const canViewPortfolio = (
  userRole: UserRole,
  portfolioOwnerId?: string,
  userId?: string
): boolean => {
  // Executives can view all portfolios
  if (userRole === 'executive') return true;

  // Portfolio managers can view their own portfolios
  if (userRole === 'portfolio_manager') {
    return portfolioOwnerId === userId && !!portfolioOwnerId && !!userId;
  }

  // Project officers cannot view portfolios directly
  return false;
};

// Permission hook for React components
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    hasRole: (requiredRole: UserRole) => (user ? hasRole(user.role, requiredRole) : false),
    canAccessResource: (
      resourceType: 'project' | 'portfolio' | 'dashboard' | 'admin',
      action: 'view' | 'edit' | 'delete' | 'create'
    ) => (user ? canAccessResource(user.role, resourceType, action) : false),
    canViewProject: (projectOwnerId?: string) =>
      user ? canViewProject(user.role, projectOwnerId, user.id) : false,
    canEditProject: (projectOwnerId?: string) =>
      user ? canEditProject(user.role, projectOwnerId, user.id) : false,
    canViewPortfolio: (portfolioOwnerId?: string) =>
      user ? canViewPortfolio(user.role, portfolioOwnerId, user.id) : false,
  };
};
