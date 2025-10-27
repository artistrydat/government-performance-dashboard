import { describe, it, expect } from 'vitest';
import {
  ROUTE_CONFIG,
  getRoutesForRole,
  getNavigationRoutes,
  canAccessRoute,
  getRouteTitle,
  getRouteDescription,
} from '../lib/routes';

describe('Route Configuration', () => {
  describe('ROUTE_CONFIG', () => {
    it('should have all required routes defined', () => {
      const expectedRoutes = [
        'dashboard',
        'executive',
        'portfolios',
        'portfolioDetail',
        'projects',
        'projectDetail',
        'risks',
        'compliance',
        'insights',
        'profile',
        'login',
        'logout',
      ];

      expectedRoutes.forEach(routeKey => {
        expect(ROUTE_CONFIG[routeKey]).toBeDefined();
        expect(ROUTE_CONFIG[routeKey].path).toBeDefined();
        expect(ROUTE_CONFIG[routeKey].title).toBeDefined();
        expect(ROUTE_CONFIG[routeKey].description).toBeDefined();
        expect(typeof ROUTE_CONFIG[routeKey].showInNavigation).toBe('boolean');
      });
    });

    it('should have correct role requirements for protected routes', () => {
      expect(ROUTE_CONFIG.executive.requiredRole).toBe('executive');
      expect(ROUTE_CONFIG.portfolios.requiredRole).toBe('portfolio_manager');
      expect(ROUTE_CONFIG.projects.requiredRole).toBe('project_officer');
      expect(ROUTE_CONFIG.compliance.requiredRole).toBe('portfolio_manager');
      expect(ROUTE_CONFIG.dashboard.requiredRole).toBeUndefined();
      expect(ROUTE_CONFIG.risks.requiredRole).toBeUndefined();
      expect(ROUTE_CONFIG.insights.requiredRole).toBeUndefined();
    });

    it('should have correct navigation visibility', () => {
      expect(ROUTE_CONFIG.dashboard.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.executive.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.portfolios.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.projects.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.risks.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.compliance.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.insights.showInNavigation).toBe(true);
      expect(ROUTE_CONFIG.portfolioDetail.showInNavigation).toBe(false);
      expect(ROUTE_CONFIG.projectDetail.showInNavigation).toBe(false);
      expect(ROUTE_CONFIG.profile.showInNavigation).toBe(false);
      expect(ROUTE_CONFIG.login.showInNavigation).toBe(false);
      expect(ROUTE_CONFIG.logout.showInNavigation).toBe(false);
    });
  });

  describe('getRoutesForRole', () => {
    it('should return all routes for executive role', () => {
      const executiveRoutes = getRoutesForRole('executive');
      expect(executiveRoutes.length).toBeGreaterThan(0);

      // Executive should have access to all routes
      const allRoutes = Object.values(ROUTE_CONFIG);
      expect(executiveRoutes.length).toBe(allRoutes.length);
    });

    it('should return appropriate routes for portfolio manager', () => {
      const portfolioManagerRoutes = getRoutesForRole('portfolio_manager');

      // Portfolio manager should have access to their routes plus public routes
      expect(portfolioManagerRoutes).toContainEqual(
        expect.objectContaining({ path: '/portfolios' })
      );
      expect(portfolioManagerRoutes).toContainEqual(
        expect.objectContaining({ path: '/compliance' })
      );
      expect(portfolioManagerRoutes).toContainEqual(expect.objectContaining({ path: '/' }));
      expect(portfolioManagerRoutes).toContainEqual(expect.objectContaining({ path: '/risks' }));

      // Should not have access to executive-only routes
      const executiveRoutes = portfolioManagerRoutes.filter(
        route => route.requiredRole === 'executive'
      );
      expect(executiveRoutes.length).toBe(0);
    });

    it('should return appropriate routes for project officer', () => {
      const projectOfficerRoutes = getRoutesForRole('project_officer');

      // Project officer should have access to their routes plus public routes
      expect(projectOfficerRoutes).toContainEqual(expect.objectContaining({ path: '/projects' }));
      expect(projectOfficerRoutes).toContainEqual(expect.objectContaining({ path: '/' }));
      expect(projectOfficerRoutes).toContainEqual(expect.objectContaining({ path: '/risks' }));
      expect(projectOfficerRoutes).toContainEqual(expect.objectContaining({ path: '/insights' }));

      // Should not have access to executive or portfolio manager only routes
      const restrictedRoutes = projectOfficerRoutes.filter(
        route => route.requiredRole === 'executive' || route.requiredRole === 'portfolio_manager'
      );
      expect(restrictedRoutes.length).toBe(0);
    });
  });

  describe('getNavigationRoutes', () => {
    it('should return only navigation-visible routes for executive', () => {
      const executiveNavRoutes = getNavigationRoutes('executive');

      expect(executiveNavRoutes.every(route => route.showInNavigation)).toBe(true);
      expect(executiveNavRoutes).toContainEqual(expect.objectContaining({ path: '/executive' }));
      expect(executiveNavRoutes).toContainEqual(expect.objectContaining({ path: '/compliance' }));
    });

    it('should return only navigation-visible routes for portfolio manager', () => {
      const portfolioManagerNavRoutes = getNavigationRoutes('portfolio_manager');

      expect(portfolioManagerNavRoutes.every(route => route.showInNavigation)).toBe(true);
      expect(portfolioManagerNavRoutes).toContainEqual(
        expect.objectContaining({ path: '/portfolios' })
      );
      expect(portfolioManagerNavRoutes).toContainEqual(
        expect.objectContaining({ path: '/compliance' })
      );
      expect(portfolioManagerNavRoutes).not.toContainEqual(
        expect.objectContaining({ path: '/executive' })
      );
    });

    it('should return only navigation-visible routes for project officer', () => {
      const projectOfficerNavRoutes = getNavigationRoutes('project_officer');

      expect(projectOfficerNavRoutes.every(route => route.showInNavigation)).toBe(true);
      expect(projectOfficerNavRoutes).toContainEqual(
        expect.objectContaining({ path: '/projects' })
      );
      expect(projectOfficerNavRoutes).toContainEqual(expect.objectContaining({ path: '/risks' }));
      expect(projectOfficerNavRoutes).not.toContainEqual(
        expect.objectContaining({ path: '/executive' })
      );
      expect(projectOfficerNavRoutes).not.toContainEqual(
        expect.objectContaining({ path: '/portfolios' })
      );
      expect(projectOfficerNavRoutes).not.toContainEqual(
        expect.objectContaining({ path: '/compliance' })
      );
    });
  });

  describe('canAccessRoute', () => {
    it('should allow executive to access all routes', () => {
      Object.values(ROUTE_CONFIG).forEach(route => {
        expect(canAccessRoute('executive', route.path)).toBe(true);
      });
    });

    it('should allow portfolio manager to access appropriate routes', () => {
      expect(canAccessRoute('portfolio_manager', '/portfolios')).toBe(true);
      expect(canAccessRoute('portfolio_manager', '/compliance')).toBe(true);
      expect(canAccessRoute('portfolio_manager', '/')).toBe(true);
      expect(canAccessRoute('portfolio_manager', '/risks')).toBe(true);
      expect(canAccessRoute('portfolio_manager', '/insights')).toBe(true);
      expect(canAccessRoute('portfolio_manager', '/executive')).toBe(false);
    });

    it('should allow project officer to access appropriate routes', () => {
      expect(canAccessRoute('project_officer', '/projects')).toBe(true);
      expect(canAccessRoute('project_officer', '/')).toBe(true);
      expect(canAccessRoute('project_officer', '/risks')).toBe(true);
      expect(canAccessRoute('project_officer', '/insights')).toBe(true);
      expect(canAccessRoute('project_officer', '/executive')).toBe(false);
      expect(canAccessRoute('project_officer', '/portfolios')).toBe(false);
      expect(canAccessRoute('project_officer', '/compliance')).toBe(false);
    });

    it('should handle unknown routes', () => {
      expect(canAccessRoute('executive', '/unknown')).toBe(false);
      expect(canAccessRoute('portfolio_manager', '/unknown')).toBe(false);
      expect(canAccessRoute('project_officer', '/unknown')).toBe(false);
    });
  });

  describe('getRouteTitle and getRouteDescription', () => {
    it('should return correct title for known routes', () => {
      expect(getRouteTitle('/')).toBe('Dashboard');
      expect(getRouteTitle('/executive')).toBe('Executive Dashboard');
      expect(getRouteTitle('/portfolios')).toBe('Portfolio Management');
      expect(getRouteTitle('/projects')).toBe('Project Management');
      expect(getRouteTitle('/risks')).toBe('Risk Management');
    });

    it('should return correct description for known routes', () => {
      expect(getRouteDescription('/executive')).toBe('High-level portfolio view for executives');
      expect(getRouteDescription('/portfolios')).toBe('Manage and monitor project portfolios');
      expect(getRouteDescription('/projects')).toBe('Manage individual projects');
    });

    it('should return default values for unknown routes', () => {
      expect(getRouteTitle('/unknown')).toBe('Unknown Route');
      expect(getRouteDescription('/unknown')).toBe('');
    });
  });

  describe('Role Hierarchy', () => {
    it('should respect role hierarchy in access control', () => {
      // Executive > Portfolio Manager > Project Officer
      const executiveRoutes = getRoutesForRole('executive');
      const portfolioManagerRoutes = getRoutesForRole('portfolio_manager');
      const projectOfficerRoutes = getRoutesForRole('project_officer');

      // Executive should have access to everything
      expect(executiveRoutes.length).toBe(Object.values(ROUTE_CONFIG).length);

      // Portfolio manager should have more access than project officer
      expect(portfolioManagerRoutes.length).toBeGreaterThan(projectOfficerRoutes.length);

      // Project officer should have the least access
      expect(projectOfficerRoutes.length).toBeLessThan(portfolioManagerRoutes.length);
    });
  });
});
