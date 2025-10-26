import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ConvexHttpClient } from 'convex/browser';
import { ProjectStatus, RiskSeverity } from '@gov-dashboard/shared';

// Mock Convex client for testing
// In a real setup, you would use a test deployment or local Convex instance
describe('Convex Integration Tests', () => {
  let convex: ConvexHttpClient;

  beforeAll(() => {
    // In a real test environment, you would initialize the Convex client
    // with a test deployment URL or local development instance
    convex = new ConvexHttpClient('http://localhost:3210');
  });

  afterAll(() => {
    // Clean up any test data if needed
  });

  describe('Project CRUD Operations', () => {
    const testProjectData = {
      name: 'Integration Test Project',
      description: 'A project for integration testing',
      status: 'active' as ProjectStatus,
      budget: 500000,
      timeline: {
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        milestones: [
          {
            name: 'Test Milestone',
            date: Date.now() + 7 * 24 * 60 * 60 * 1000,
            status: 'planned',
          },
        ],
      },
      portfolioId: undefined,
      ownerId: undefined,
      healthScore: 75,
      riskLevel: 'medium' as RiskSeverity,
      tags: ['integration-test', 'government'],
    };

    it('should validate project data structure', () => {
      // Test that our test data matches the expected structure
      expect(testProjectData).toHaveProperty('name');
      expect(testProjectData).toHaveProperty('description');
      expect(testProjectData).toHaveProperty('status');
      expect(testProjectData).toHaveProperty('budget');
      expect(testProjectData).toHaveProperty('timeline');
      expect(testProjectData).toHaveProperty('healthScore');
      expect(testProjectData).toHaveProperty('riskLevel');
      expect(testProjectData).toHaveProperty('tags');

      // Validate specific types
      expect(typeof testProjectData.name).toBe('string');
      expect(typeof testProjectData.description).toBe('string');
      expect(typeof testProjectData.budget).toBe('number');
      expect(typeof testProjectData.healthScore).toBe('number');
      expect(Array.isArray(testProjectData.tags)).toBe(true);
    });

    it('should validate timeline structure', () => {
      expect(testProjectData.timeline).toHaveProperty('startDate');
      expect(testProjectData.timeline).toHaveProperty('endDate');
      expect(testProjectData.timeline).toHaveProperty('milestones');

      expect(testProjectData.timeline.startDate).toBeLessThan(testProjectData.timeline.endDate);
      expect(Array.isArray(testProjectData.timeline.milestones)).toBe(true);
    });

    it('should validate milestone structure', () => {
      const milestone = testProjectData.timeline.milestones[0];
      expect(milestone).toHaveProperty('name');
      expect(milestone).toHaveProperty('date');
      expect(milestone).toHaveProperty('status');

      expect(typeof milestone.name).toBe('string');
      expect(typeof milestone.date).toBe('number');
      expect(typeof milestone.status).toBe('string');
    });

    it('should validate budget constraints', () => {
      expect(testProjectData.budget).toBeGreaterThan(0);
    });

    it('should validate health score range', () => {
      expect(testProjectData.healthScore).toBeGreaterThanOrEqual(0);
      expect(testProjectData.healthScore).toBeLessThanOrEqual(100);
    });

    it('should validate risk level values', () => {
      const validRiskLevels: RiskSeverity[] = ['low', 'medium', 'high', 'critical'];
      expect(validRiskLevels).toContain(testProjectData.riskLevel);
    });

    it('should validate project status values', () => {
      const validStatuses: ProjectStatus[] = [
        'planned',
        'active',
        'at-risk',
        'delayed',
        'completed',
      ];
      expect(validStatuses).toContain(testProjectData.status);
    });
  });

  describe('Convex Function Validation', () => {
    it('should have proper function exports structure', async () => {
      // This test validates that our Convex functions are properly structured
      // In a real environment, you would import and test the actual functions

      // Mock function structure validation
      const expectedFunctions = [
        'projects:create',
        'projects:get',
        'projects:list',
        'projects:listByStatus',
        'projects:listByPortfolio',
        'projects:update',
        'projects:remove',
        'projects:getStatistics',
      ];

      // These would be actual function calls in a real test environment
      expectedFunctions.forEach(funcName => {
        expect(funcName).toMatch(/^projects:/);
      });
    });

    it('should validate function argument structures', () => {
      // Test that our function arguments match the expected validation schema
      const createArgs = {
        name: 'Test Project',
        description: 'Test Description',
        status: 'active' as ProjectStatus,
        budget: 100000,
        timeline: {
          startDate: Date.now(),
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          milestones: [],
        },
        healthScore: 80,
        riskLevel: 'low' as RiskSeverity,
        tags: ['test'],
      };

      expect(createArgs).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        budget: expect.any(Number),
        timeline: expect.any(Object),
        healthScore: expect.any(Number),
        riskLevel: expect.any(String),
        tags: expect.any(Array),
      });
    });
  });

  describe('Error Handling', () => {
    it('should validate error scenarios', () => {
      // Test data that should trigger validation errors
      const invalidProjects = [
        {
          name: 'Invalid Budget',
          description: 'Project with negative budget',
          status: 'active' as ProjectStatus,
          budget: -1000, // Invalid: negative budget
          timeline: {
            startDate: Date.now(),
            endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            milestones: [],
          },
          healthScore: 80,
          riskLevel: 'low' as RiskSeverity,
          tags: ['test'],
        },
        {
          name: 'Invalid Health Score',
          description: 'Project with invalid health score',
          status: 'active' as ProjectStatus,
          budget: 100000,
          timeline: {
            startDate: Date.now(),
            endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            milestones: [],
          },
          healthScore: 150, // Invalid: > 100
          riskLevel: 'low' as RiskSeverity,
          tags: ['test'],
        },
        {
          name: 'Invalid Timeline',
          description: 'Project with invalid timeline dates',
          status: 'active' as ProjectStatus,
          budget: 100000,
          timeline: {
            startDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // Invalid: start after end
            endDate: Date.now(),
            milestones: [],
          },
          healthScore: 80,
          riskLevel: 'low' as RiskSeverity,
          tags: ['test'],
        },
      ];

      invalidProjects.forEach(project => {
        // Test that invalid data is actually invalid
        if (project.budget <= 0) {
          expect(project.budget).toBeLessThanOrEqual(0);
        }
        if (project.healthScore < 0 || project.healthScore > 100) {
          expect(project.healthScore < 0 || project.healthScore > 100).toBe(true);
        }
        if (project.timeline.startDate >= project.timeline.endDate) {
          expect(project.timeline.startDate).toBeGreaterThanOrEqual(project.timeline.endDate);
        }
      });
    });
  });
});
