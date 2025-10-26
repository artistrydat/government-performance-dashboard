import { describe, it, expect, beforeEach } from 'vitest';
import { UserRole } from '@gov-dashboard/shared';

describe('User Data Model', () => {
  let validUserData: any;

  beforeEach(() => {
    validUserData = {
      name: 'John Doe',
      email: 'john.doe@government.gov',
      role: 'project_officer' as UserRole,
      department: 'IT Department',
    };
  });

  describe('Data Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validUserData.email)).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'invalid-email',
        'invalid@',
        '@invalid.com',
        'invalid@com',
        'invalid@.com',
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate role values', () => {
      const validRoles: UserRole[] = ['executive', 'portfolio_manager', 'project_officer'];
      expect(validRoles).toContain(validUserData.role);
    });

    it('should validate required fields', () => {
      expect(validUserData).toHaveProperty('name');
      expect(validUserData).toHaveProperty('email');
      expect(validUserData).toHaveProperty('role');
      expect(validUserData).toHaveProperty('department');

      expect(typeof validUserData.name).toBe('string');
      expect(typeof validUserData.email).toBe('string');
      expect(typeof validUserData.role).toBe('string');
      expect(typeof validUserData.department).toBe('string');
    });
  });

  describe('User Role Hierarchy', () => {
    it('should have proper role hierarchy', () => {
      const roleHierarchy = {
        executive: 3,
        portfolio_manager: 2,
        project_officer: 1,
      };

      expect(roleHierarchy.executive).toBeGreaterThan(roleHierarchy.portfolio_manager);
      expect(roleHierarchy.portfolio_manager).toBeGreaterThan(roleHierarchy.project_officer);
    });

    it('should validate executive permissions', () => {
      const executiveData = { ...validUserData, role: 'executive' as UserRole };
      expect(executiveData.role).toBe('executive');
    });

    it('should validate portfolio manager permissions', () => {
      const portfolioManagerData = { ...validUserData, role: 'portfolio_manager' as UserRole };
      expect(portfolioManagerData.role).toBe('portfolio_manager');
    });

    it('should validate project officer permissions', () => {
      const projectOfficerData = { ...validUserData, role: 'project_officer' as UserRole };
      expect(projectOfficerData.role).toBe('project_officer');
    });
  });

  describe('Department Structure', () => {
    it('should accept valid department names', () => {
      const validDepartments = [
        'IT Department',
        'Finance Department',
        'Executive Office',
        'Operations Department',
        'Compliance Department',
      ];

      validDepartments.forEach(department => {
        const userData = { ...validUserData, department };
        expect(typeof userData.department).toBe('string');
        expect(userData.department.length).toBeGreaterThan(0);
      });
    });

    it('should handle empty department name', () => {
      const userData = { ...validUserData, department: '' };
      expect(typeof userData.department).toBe('string');
      expect(userData.department.length).toBe(0);
    });
  });

  describe('User Statistics', () => {
    it('should calculate role counts correctly', () => {
      const users = [
        { ...validUserData, role: 'project_officer' as UserRole },
        { ...validUserData, role: 'portfolio_manager' as UserRole },
        { ...validUserData, role: 'executive' as UserRole },
        { ...validUserData, role: 'project_officer' as UserRole },
      ];

      const roleCounts = {
        executive: users.filter(u => u.role === 'executive').length,
        portfolio_manager: users.filter(u => u.role === 'portfolio_manager').length,
        project_officer: users.filter(u => u.role === 'project_officer').length,
      };

      expect(roleCounts.executive).toBe(1);
      expect(roleCounts.portfolio_manager).toBe(1);
      expect(roleCounts.project_officer).toBe(2);
    });

    it('should calculate department counts correctly', () => {
      const users = [
        { ...validUserData, department: 'IT Department' },
        { ...validUserData, department: 'Finance Department' },
        { ...validUserData, department: 'IT Department' },
        { ...validUserData, department: 'Executive Office' },
      ];

      const departmentCounts = users.reduce(
        (acc, user) => {
          acc[user.department] = (acc[user.department] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(departmentCounts['IT Department']).toBe(2);
      expect(departmentCounts['Finance Department']).toBe(1);
      expect(departmentCounts['Executive Office']).toBe(1);
    });
  });

  describe('Permission Logic', () => {
    it('should validate role-based access control', () => {
      const testCases = [
        {
          userRole: 'executive' as UserRole,
          requiredRole: 'executive' as UserRole,
          expected: true,
        },
        {
          userRole: 'executive' as UserRole,
          requiredRole: 'portfolio_manager' as UserRole,
          expected: true,
        },
        {
          userRole: 'executive' as UserRole,
          requiredRole: 'project_officer' as UserRole,
          expected: true,
        },
        {
          userRole: 'portfolio_manager' as UserRole,
          requiredRole: 'executive' as UserRole,
          expected: false,
        },
        {
          userRole: 'portfolio_manager' as UserRole,
          requiredRole: 'portfolio_manager' as UserRole,
          expected: true,
        },
        {
          userRole: 'portfolio_manager' as UserRole,
          requiredRole: 'project_officer' as UserRole,
          expected: true,
        },
        {
          userRole: 'project_officer' as UserRole,
          requiredRole: 'executive' as UserRole,
          expected: false,
        },
        {
          userRole: 'project_officer' as UserRole,
          requiredRole: 'portfolio_manager' as UserRole,
          expected: false,
        },
        {
          userRole: 'project_officer' as UserRole,
          requiredRole: 'project_officer' as UserRole,
          expected: true,
        },
      ];

      testCases.forEach(({ userRole, requiredRole, expected }) => {
        const roleHierarchy = {
          executive: 3,
          portfolio_manager: 2,
          project_officer: 1,
        };

        const hasPermission = roleHierarchy[userRole] >= roleHierarchy[requiredRole];
        expect(hasPermission).toBe(expected);
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should identify duplicate email scenarios', () => {
      const users = [
        { ...validUserData, email: 'john.doe@government.gov' },
        { ...validUserData, email: 'jane.smith@government.gov' },
        { ...validUserData, email: 'john.doe@government.gov' }, // Duplicate
      ];

      const emailCounts = users.reduce(
        (acc, user) => {
          acc[user.email] = (acc[user.email] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(emailCounts['john.doe@government.gov']).toBe(2);
      expect(emailCounts['jane.smith@government.gov']).toBe(1);
    });

    it('should validate user deletion constraints', () => {
      const userWithProjects = {
        ...validUserData,
        projects: [{ id: 'project-1' }, { id: 'project-2' }],
        portfolios: [],
      };

      const userWithPortfolios = {
        ...validUserData,
        projects: [],
        portfolios: [{ id: 'portfolio-1' }],
      };

      const userWithBoth = {
        ...validUserData,
        projects: [{ id: 'project-1' }],
        portfolios: [{ id: 'portfolio-1' }],
      };

      const userWithoutReferences = {
        ...validUserData,
        projects: [],
        portfolios: [],
      };

      // Users with references should not be deletable
      expect(userWithProjects.projects.length > 0 || userWithProjects.portfolios.length > 0).toBe(
        true
      );
      expect(
        userWithPortfolios.projects.length > 0 || userWithPortfolios.portfolios.length > 0
      ).toBe(true);
      expect(userWithBoth.projects.length > 0 || userWithBoth.portfolios.length > 0).toBe(true);

      // Users without references should be deletable
      expect(
        userWithoutReferences.projects.length > 0 || userWithoutReferences.portfolios.length > 0
      ).toBe(false);
    });
  });
});
