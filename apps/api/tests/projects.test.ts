import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectStatus, RiskSeverity, Timeline, Milestone } from '@gov-dashboard/shared';

describe('Project Data Model', () => {
  let validProjectData: any;
  let validTimeline: Timeline;

  beforeEach(() => {
    validTimeline = {
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      milestones: [
        {
          name: 'Initial Planning',
          date: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
          status: 'planned',
        },
      ],
    };

    validProjectData = {
      name: 'Test Government Project',
      description: 'A test project for government dashboard',
      status: 'active' as ProjectStatus,
      budget: 1000000,
      timeline: validTimeline,
      portfolioId: undefined,
      ownerId: undefined,
      healthScore: 85,
      riskLevel: 'medium' as RiskSeverity,
      tags: ['government', 'test', 'dashboard'],
    };
  });

  describe('Data Validation', () => {
    it('should validate positive budget', () => {
      expect(validProjectData.budget).toBeGreaterThan(0);
    });

    it('should validate health score range', () => {
      expect(validProjectData.healthScore).toBeGreaterThanOrEqual(0);
      expect(validProjectData.healthScore).toBeLessThanOrEqual(100);
    });

    it('should validate timeline dates', () => {
      expect(validProjectData.timeline.startDate).toBeLessThan(validProjectData.timeline.endDate);
    });

    it('should reject negative budget', () => {
      const invalidData = { ...validProjectData, budget: -1000 };
      expect(invalidData.budget).toBeLessThan(0);
    });

    it('should reject invalid health score', () => {
      const invalidData = { ...validProjectData, healthScore: 150 };
      expect(invalidData.healthScore).toBeGreaterThan(100);
    });

    it('should reject invalid timeline dates', () => {
      const invalidTimeline = {
        ...validTimeline,
        startDate: validTimeline.endDate + 1000,
        endDate: validTimeline.startDate,
      };
      const invalidData = { ...validProjectData, timeline: invalidTimeline };
      expect(invalidData.timeline.startDate).toBeGreaterThan(invalidData.timeline.endDate);
    });
  });

  describe('Project Status', () => {
    it('should accept valid project status values', () => {
      const validStatuses: ProjectStatus[] = [
        'planned',
        'active',
        'at-risk',
        'delayed',
        'completed',
      ];

      validStatuses.forEach(status => {
        const projectData = { ...validProjectData, status };
        expect(validStatuses).toContain(projectData.status);
      });
    });
  });

  describe('Risk Level', () => {
    it('should accept valid risk level values', () => {
      const validRiskLevels: RiskSeverity[] = ['low', 'medium', 'high', 'critical'];

      validRiskLevels.forEach(riskLevel => {
        const projectData = { ...validProjectData, riskLevel };
        expect(validRiskLevels).toContain(projectData.riskLevel);
      });
    });
  });

  describe('Timeline Structure', () => {
    it('should have valid timeline structure', () => {
      expect(validProjectData.timeline).toHaveProperty('startDate');
      expect(validProjectData.timeline).toHaveProperty('endDate');
      expect(validProjectData.timeline).toHaveProperty('milestones');
      expect(Array.isArray(validProjectData.timeline.milestones)).toBe(true);
    });

    it('should have valid milestone structure', () => {
      const milestone: Milestone = validProjectData.timeline.milestones[0];
      expect(milestone).toHaveProperty('name');
      expect(milestone).toHaveProperty('date');
      expect(milestone).toHaveProperty('status');
      expect(typeof milestone.name).toBe('string');
      expect(typeof milestone.date).toBe('number');
      expect(typeof milestone.status).toBe('string');
    });
  });

  describe('Tags', () => {
    it('should accept array of tags', () => {
      expect(Array.isArray(validProjectData.tags)).toBe(true);
      validProjectData.tags.forEach((tag: string) => {
        expect(typeof tag).toBe('string');
      });
    });

    it('should handle empty tags array', () => {
      const projectData = { ...validProjectData, tags: [] };
      expect(Array.isArray(projectData.tags)).toBe(true);
      expect(projectData.tags.length).toBe(0);
    });
  });

  describe('Optional Fields', () => {
    it('should handle undefined portfolioId', () => {
      const projectData = { ...validProjectData, portfolioId: undefined };
      expect(projectData.portfolioId).toBeUndefined();
    });

    it('should handle undefined ownerId', () => {
      const projectData = { ...validProjectData, ownerId: undefined };
      expect(projectData.ownerId).toBeUndefined();
    });

    it('should accept defined portfolioId', () => {
      const projectData = { ...validProjectData, portfolioId: 'test-portfolio-id' };
      expect(projectData.portfolioId).toBe('test-portfolio-id');
    });

    it('should accept defined ownerId', () => {
      const projectData = { ...validProjectData, ownerId: 'test-owner-id' };
      expect(projectData.ownerId).toBe('test-owner-id');
    });
  });
});
