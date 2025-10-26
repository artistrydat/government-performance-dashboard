import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hasRole,
  canAccessResource,
  canViewProject,
  canEditProject,
  canViewPortfolio,
} from '../lib/permissions';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

describe('Role-Based Access Control', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('hasRole function', () => {
    it('should return true when user has higher role than required', () => {
      expect(hasRole('executive', 'project_officer')).toBe(true);
      expect(hasRole('portfolio_manager', 'project_officer')).toBe(true);
    });

    it('should return true when user has same role as required', () => {
      expect(hasRole('executive', 'executive')).toBe(true);
      expect(hasRole('portfolio_manager', 'portfolio_manager')).toBe(true);
      expect(hasRole('project_officer', 'project_officer')).toBe(true);
    });

    it('should return false when user has lower role than required', () => {
      expect(hasRole('project_officer', 'portfolio_manager')).toBe(false);
      expect(hasRole('project_officer', 'executive')).toBe(false);
      expect(hasRole('portfolio_manager', 'executive')).toBe(false);
    });
  });

  describe('canAccessResource function', () => {
    describe('project resources', () => {
      it('should allow project officers to view and edit projects', () => {
        expect(canAccessResource('project_officer', 'project', 'view')).toBe(true);
        expect(canAccessResource('project_officer', 'project', 'edit')).toBe(true);
      });

      it('should not allow project officers to delete or create projects', () => {
        expect(canAccessResource('project_officer', 'project', 'delete')).toBe(false);
        expect(canAccessResource('project_officer', 'project', 'create')).toBe(false);
      });

      it('should allow portfolio managers to perform all project operations', () => {
        expect(canAccessResource('portfolio_manager', 'project', 'view')).toBe(true);
        expect(canAccessResource('portfolio_manager', 'project', 'edit')).toBe(true);
        expect(canAccessResource('portfolio_manager', 'project', 'delete')).toBe(true);
        expect(canAccessResource('portfolio_manager', 'project', 'create')).toBe(true);
      });

      it('should allow executives to perform all project operations', () => {
        expect(canAccessResource('executive', 'project', 'view')).toBe(true);
        expect(canAccessResource('executive', 'project', 'edit')).toBe(true);
        expect(canAccessResource('executive', 'project', 'delete')).toBe(true);
        expect(canAccessResource('executive', 'project', 'create')).toBe(true);
      });
    });

    describe('portfolio resources', () => {
      it('should not allow project officers to access portfolios', () => {
        expect(canAccessResource('project_officer', 'portfolio', 'view')).toBe(false);
        expect(canAccessResource('project_officer', 'portfolio', 'edit')).toBe(false);
        expect(canAccessResource('project_officer', 'portfolio', 'delete')).toBe(false);
        expect(canAccessResource('project_officer', 'portfolio', 'create')).toBe(false);
      });

      it('should allow portfolio managers to view and edit portfolios', () => {
        expect(canAccessResource('portfolio_manager', 'portfolio', 'view')).toBe(true);
        expect(canAccessResource('portfolio_manager', 'portfolio', 'edit')).toBe(true);
      });

      it('should not allow portfolio managers to delete or create portfolios', () => {
        expect(canAccessResource('portfolio_manager', 'portfolio', 'delete')).toBe(false);
        expect(canAccessResource('portfolio_manager', 'portfolio', 'create')).toBe(false);
      });

      it('should allow executives to perform all portfolio operations', () => {
        expect(canAccessResource('executive', 'portfolio', 'view')).toBe(true);
        expect(canAccessResource('executive', 'portfolio', 'edit')).toBe(true);
        expect(canAccessResource('executive', 'portfolio', 'delete')).toBe(true);
        expect(canAccessResource('executive', 'portfolio', 'create')).toBe(true);
      });
    });

    describe('dashboard resources', () => {
      it('should allow all roles to view dashboard', () => {
        expect(canAccessResource('project_officer', 'dashboard', 'view')).toBe(true);
        expect(canAccessResource('portfolio_manager', 'dashboard', 'view')).toBe(true);
        expect(canAccessResource('executive', 'dashboard', 'view')).toBe(true);
      });

      it('should restrict dashboard editing to portfolio managers and executives', () => {
        expect(canAccessResource('project_officer', 'dashboard', 'edit')).toBe(false);
        expect(canAccessResource('portfolio_manager', 'dashboard', 'edit')).toBe(true);
        expect(canAccessResource('executive', 'dashboard', 'edit')).toBe(true);
      });
    });

    describe('admin resources', () => {
      it('should restrict admin access to executives only', () => {
        expect(canAccessResource('project_officer', 'admin', 'view')).toBe(false);
        expect(canAccessResource('portfolio_manager', 'admin', 'view')).toBe(false);
        expect(canAccessResource('executive', 'admin', 'view')).toBe(true);
      });
    });
  });

  describe('canViewProject function', () => {
    const testUserId = 'user-123';
    const otherUserId = 'user-456';

    it('should allow executives to view any project', () => {
      expect(canViewProject('executive', otherUserId, testUserId)).toBe(true);
      expect(canViewProject('executive', undefined, testUserId)).toBe(true);
    });

    it('should allow portfolio managers to view any project', () => {
      expect(canViewProject('portfolio_manager', otherUserId, testUserId)).toBe(true);
      expect(canViewProject('portfolio_manager', undefined, testUserId)).toBe(true);
    });

    it('should allow project officers to view only their own projects', () => {
      expect(canViewProject('project_officer', testUserId, testUserId)).toBe(true);
      expect(canViewProject('project_officer', otherUserId, testUserId)).toBe(false);
      expect(canViewProject('project_officer', undefined, testUserId)).toBe(false);
    });
  });

  describe('canEditProject function', () => {
    const testUserId = 'user-123';
    const otherUserId = 'user-456';

    it('should allow executives to edit any project', () => {
      expect(canEditProject('executive', otherUserId, testUserId)).toBe(true);
      expect(canEditProject('executive', undefined, testUserId)).toBe(true);
    });

    it('should allow portfolio managers to edit any project', () => {
      expect(canEditProject('portfolio_manager', otherUserId, testUserId)).toBe(true);
      expect(canEditProject('portfolio_manager', undefined, testUserId)).toBe(true);
    });

    it('should allow project officers to edit only their own projects', () => {
      expect(canEditProject('project_officer', testUserId, testUserId)).toBe(true);
      expect(canEditProject('project_officer', otherUserId, testUserId)).toBe(false);
      expect(canEditProject('project_officer', undefined, testUserId)).toBe(false);
    });
  });

  describe('canViewPortfolio function', () => {
    const testUserId = 'user-123';
    const otherUserId = 'user-456';

    it('should allow executives to view any portfolio', () => {
      expect(canViewPortfolio('executive', otherUserId, testUserId)).toBe(true);
      expect(canViewPortfolio('executive', undefined, testUserId)).toBe(true);
    });

    it('should allow portfolio managers to view only their own portfolios', () => {
      expect(canViewPortfolio('portfolio_manager', testUserId, testUserId)).toBe(true);
      expect(canViewPortfolio('portfolio_manager', otherUserId, testUserId)).toBe(false);
      expect(canViewPortfolio('portfolio_manager', undefined, testUserId)).toBe(false);
    });

    it('should not allow project officers to view any portfolios', () => {
      expect(canViewPortfolio('project_officer', testUserId, testUserId)).toBe(false);
      expect(canViewPortfolio('project_officer', otherUserId, testUserId)).toBe(false);
      expect(canViewPortfolio('project_officer', undefined, testUserId)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined user IDs gracefully', () => {
      expect(canViewProject('project_officer', undefined, undefined)).toBe(false);
      expect(canEditProject('project_officer', undefined, undefined)).toBe(false);
      expect(canViewPortfolio('portfolio_manager', undefined, undefined)).toBe(false);
    });

    it('should handle empty strings as user IDs', () => {
      expect(canViewProject('project_officer', '', '')).toBe(false);
      expect(canEditProject('project_officer', '', '')).toBe(false);
      expect(canViewPortfolio('portfolio_manager', '', '')).toBe(false);
    });
  });
});
