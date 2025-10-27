import { UserRole } from './auth';

export interface RouteConfig {
  path: string;
  component: string;
  requiredRole?: UserRole;
  title: string;
  description: string;
  icon?: string;
  showInNavigation: boolean;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  dashboard: {
    path: '/',
    component: 'DashboardPage',
    title: 'Dashboard',
    description: 'Main dashboard overview',
    showInNavigation: true,
  },
  executive: {
    path: '/executive',
    component: 'ExecutiveDashboard',
    requiredRole: 'executive',
    title: 'Executive Dashboard',
    description: 'High-level portfolio view for executives',
    showInNavigation: true,
  },
  portfolios: {
    path: '/portfolios',
    component: 'PortfolioList',
    requiredRole: 'portfolio_manager',
    title: 'Portfolio Management',
    description: 'Manage and monitor project portfolios',
    showInNavigation: true,
  },
  portfolioDetail: {
    path: '/portfolios/:id',
    component: 'PortfolioDetail',
    requiredRole: 'portfolio_manager',
    title: 'Portfolio Details',
    description: 'Detailed view of a specific portfolio',
    showInNavigation: false,
  },
  projects: {
    path: '/projects',
    component: 'ProjectList',
    requiredRole: 'project_officer',
    title: 'Project Management',
    description: 'Manage individual projects',
    showInNavigation: true,
  },
  projectDetail: {
    path: '/projects/:id',
    component: 'ProjectDetail',
    requiredRole: 'project_officer',
    title: 'Project Details',
    description: 'Detailed view of a specific project',
    showInNavigation: false,
  },
  risks: {
    path: '/risks',
    component: 'RiskManagement',
    title: 'Risk Management',
    description: 'Risk assessment and monitoring',
    showInNavigation: true,
  },
  compliance: {
    path: '/compliance',
    component: 'ComplianceReports',
    requiredRole: 'portfolio_manager',
    title: 'Compliance Reports',
    description: 'PMI compliance reporting',
    showInNavigation: true,
  },
  insights: {
    path: '/insights',
    component: 'AIInsights',
    title: 'AI Insights',
    description: 'AI-generated predictions and insights',
    showInNavigation: true,
  },
  profile: {
    path: '/profile',
    component: 'UserProfile',
    title: 'User Profile',
    description: 'User settings and preferences',
    showInNavigation: false,
  },
  login: {
    path: '/login',
    component: 'LoginPage',
    title: 'Login',
    description: 'Authentication page',
    showInNavigation: false,
  },
  logout: {
    path: '/logout',
    component: 'LogoutPage',
    title: 'Logout',
    description: 'Session termination',
    showInNavigation: false,
  },
};

// Get routes accessible by a specific role
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return Object.values(ROUTE_CONFIG).filter(route => {
    // If no role required, accessible to all
    if (!route.requiredRole) return true;

    // Check if user has required role or higher
    const roleHierarchy: Record<UserRole, number> = {
      executive: 3,
      portfolio_manager: 2,
      project_officer: 1,
    };

    return roleHierarchy[role] >= roleHierarchy[route.requiredRole];
  });
};

// Get navigation routes for a specific role
export const getNavigationRoutes = (role: UserRole): RouteConfig[] => {
  return getRoutesForRole(role).filter(route => route.showInNavigation);
};

// Check if user can access a specific route
export const canAccessRoute = (userRole: UserRole, routePath: string): boolean => {
  const route = Object.values(ROUTE_CONFIG).find(r => r.path === routePath);

  if (!route) return false;
  if (!route.requiredRole) return true;

  const roleHierarchy: Record<UserRole, number> = {
    executive: 3,
    portfolio_manager: 2,
    project_officer: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[route.requiredRole];
};

// Get route title by path
export const getRouteTitle = (path: string): string => {
  const route = Object.values(ROUTE_CONFIG).find(r => r.path === path);
  return route?.title || 'Unknown Route';
};

// Get route description by path
export const getRouteDescription = (path: string): string => {
  const route = Object.values(ROUTE_CONFIG).find(r => r.path === path);
  return route?.description || '';
};
