import { describe, it, expect } from 'vitest';
import {
  validateBudget,
  validateHealthScore,
  validateTimelineDates,
  validateProbability,
  validateImpact,
  validateEmail,
  validateProjectStatusTransition,
  validateRiskSeverityConsistency,
  validateProjectData,
  validateRiskData,
  validateUserData,
} from '../convex/validation';

describe('Data Validation Functions', () => {
  describe('Budget Validation', () => {
    it('should accept positive budget', () => {
      expect(() => validateBudget(1000)).not.toThrow();
      expect(() => validateBudget(1)).not.toThrow();
      expect(() => validateBudget(999999)).not.toThrow();
    });

    it('should reject zero or negative budget', () => {
      expect(() => validateBudget(0)).toThrow('Budget must be a positive number');
      expect(() => validateBudget(-100)).toThrow('Budget must be a positive number');
      expect(() => validateBudget(-1)).toThrow('Budget must be a positive number');
    });
  });

  describe('Health Score Validation', () => {
    it('should accept valid health scores', () => {
      expect(() => validateHealthScore(0)).not.toThrow();
      expect(() => validateHealthScore(50)).not.toThrow();
      expect(() => validateHealthScore(100)).not.toThrow();
    });

    it('should reject invalid health scores', () => {
      expect(() => validateHealthScore(-1)).toThrow('Health score must be between 0 and 100');
      expect(() => validateHealthScore(101)).toThrow('Health score must be between 0 and 100');
      expect(() => validateHealthScore(-100)).toThrow('Health score must be between 0 and 100');
    });
  });

  describe('Timeline Dates Validation', () => {
    it('should accept valid timeline dates', () => {
      expect(() => validateTimelineDates(1000, 2000)).not.toThrow();
      expect(() => validateTimelineDates(Date.now(), Date.now() + 86400000)).not.toThrow();
    });

    it('should reject invalid timeline dates', () => {
      expect(() => validateTimelineDates(2000, 1000)).toThrow('Start date must be before end date');
      expect(() => validateTimelineDates(1000, 1000)).toThrow('Start date must be before end date');
    });
  });

  describe('Probability Validation', () => {
    it('should accept valid probabilities', () => {
      expect(() => validateProbability(0)).not.toThrow();
      expect(() => validateProbability(50)).not.toThrow();
      expect(() => validateProbability(100)).not.toThrow();
    });

    it('should reject invalid probabilities', () => {
      expect(() => validateProbability(-1)).toThrow('Probability must be between 0 and 100');
      expect(() => validateProbability(101)).toThrow('Probability must be between 0 and 100');
      expect(() => validateProbability(-50)).toThrow('Probability must be between 0 and 100');
    });
  });

  describe('Impact Validation', () => {
    it('should accept valid impacts', () => {
      expect(() => validateImpact(0)).not.toThrow();
      expect(() => validateImpact(75)).not.toThrow();
      expect(() => validateImpact(100)).not.toThrow();
    });

    it('should reject invalid impacts', () => {
      expect(() => validateImpact(-1)).toThrow('Impact must be between 0 and 100');
      expect(() => validateImpact(101)).toThrow('Impact must be between 0 and 100');
      expect(() => validateImpact(-25)).toThrow('Impact must be between 0 and 100');
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email addresses', () => {
      expect(() => validateEmail('user@example.com')).not.toThrow();
      expect(() => validateEmail('test.user+tag@domain.co.uk')).not.toThrow();
      expect(() => validateEmail('first.last@sub.domain.com')).not.toThrow();
    });

    it('should reject invalid email addresses', () => {
      expect(() => validateEmail('invalid')).toThrow('Invalid email format');
      expect(() => validateEmail('user@')).toThrow('Invalid email format');
      expect(() => validateEmail('@domain.com')).toThrow('Invalid email format');
      expect(() => validateEmail('user@domain')).toThrow('Invalid email format');
      expect(() => validateEmail('')).toThrow('Invalid email format');
    });
  });

  describe('Project Status Transition Validation', () => {
    it('should accept valid status transitions', () => {
      expect(() => validateProjectStatusTransition('planned', 'active')).not.toThrow();
      expect(() => validateProjectStatusTransition('active', 'at-risk')).not.toThrow();
      expect(() => validateProjectStatusTransition('active', 'delayed')).not.toThrow();
      expect(() => validateProjectStatusTransition('active', 'completed')).not.toThrow();
      expect(() => validateProjectStatusTransition('at-risk', 'active')).not.toThrow();
      expect(() => validateProjectStatusTransition('at-risk', 'delayed')).not.toThrow();
      expect(() => validateProjectStatusTransition('at-risk', 'completed')).not.toThrow();
      expect(() => validateProjectStatusTransition('delayed', 'active')).not.toThrow();
      expect(() => validateProjectStatusTransition('delayed', 'at-risk')).not.toThrow();
      expect(() => validateProjectStatusTransition('delayed', 'completed')).not.toThrow();
    });

    it('should accept same status transitions', () => {
      expect(() => validateProjectStatusTransition('planned', 'planned')).not.toThrow();
      expect(() => validateProjectStatusTransition('active', 'active')).not.toThrow();
      expect(() => validateProjectStatusTransition('completed', 'completed')).not.toThrow();
    });

    it('should reject invalid status transitions', () => {
      expect(() => validateProjectStatusTransition('completed', 'active')).toThrow();
      expect(() => validateProjectStatusTransition('completed', 'planned')).toThrow();
      expect(() => validateProjectStatusTransition('planned', 'completed')).toThrow();
      expect(() => validateProjectStatusTransition('planned', 'at-risk')).toThrow();
    });
  });

  describe('Risk Severity Consistency Validation', () => {
    it('should accept consistent risk severity', () => {
      // Low risk: score < 25
      expect(() => validateRiskSeverityConsistency('low', 20, 20)).not.toThrow(); // score = 4
      expect(() => validateRiskSeverityConsistency('low', 50, 10)).not.toThrow(); // score = 5

      // Medium risk: score >= 25 and < 50
      expect(() => validateRiskSeverityConsistency('medium', 50, 50)).not.toThrow(); // score = 25
      expect(() => validateRiskSeverityConsistency('medium', 70, 40)).not.toThrow(); // score = 28

      // High risk: score >= 50 and < 75
      expect(() => validateRiskSeverityConsistency('high', 80, 70)).not.toThrow(); // score = 56
      expect(() => validateRiskSeverityConsistency('high', 60, 90)).not.toThrow(); // score = 54

      // Critical risk: score >= 75
      expect(() => validateRiskSeverityConsistency('critical', 90, 90)).not.toThrow(); // score = 81
      expect(() => validateRiskSeverityConsistency('critical', 100, 80)).not.toThrow(); // score = 80
    });

    it('should reject inconsistent risk severity', () => {
      expect(() => validateRiskSeverityConsistency('low', 80, 80)).toThrow(); // score = 64, should be high
      expect(() => validateRiskSeverityConsistency('medium', 20, 20)).toThrow(); // score = 4, should be low
      expect(() => validateRiskSeverityConsistency('high', 30, 30)).toThrow(); // score = 9, should be low
      expect(() => validateRiskSeverityConsistency('critical', 50, 50)).toThrow(); // score = 25, should be medium
    });
  });

  describe('Comprehensive Project Data Validation', () => {
    const validProjectData = {
      budget: 100000,
      healthScore: 85,
      timeline: {
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        milestones: [
          { name: 'Milestone 1', date: Date.now() + 43200000, status: 'planned' },
          { name: 'Milestone 2', date: Date.now() + 64800000, status: 'planned' },
        ],
      },
    };

    it('should accept valid project data', () => {
      expect(() => validateProjectData(validProjectData)).not.toThrow();
    });

    it('should reject invalid budget', () => {
      const invalidData = { ...validProjectData, budget: -1000 };
      expect(() => validateProjectData(invalidData)).toThrow('Budget must be a positive number');
    });

    it('should reject invalid health score', () => {
      const invalidData = { ...validProjectData, healthScore: 150 };
      expect(() => validateProjectData(invalidData)).toThrow(
        'Health score must be between 0 and 100'
      );
    });

    it('should reject invalid timeline dates', () => {
      const invalidData = {
        ...validProjectData,
        timeline: { ...validProjectData.timeline, startDate: validProjectData.timeline.endDate },
      };
      expect(() => validateProjectData(invalidData)).toThrow('Start date must be before end date');
    });

    it('should reject milestones without names', () => {
      const invalidData = {
        ...validProjectData,
        timeline: {
          ...validProjectData.timeline,
          milestones: [{ ...validProjectData.timeline.milestones[0], name: '' }],
        },
      };
      expect(() => validateProjectData(invalidData)).toThrow('Milestone 1 must have a name');
    });

    it('should reject milestones outside timeline', () => {
      const invalidData = {
        ...validProjectData,
        timeline: {
          ...validProjectData.timeline,
          milestones: [
            {
              ...validProjectData.timeline.milestones[0],
              date: validProjectData.timeline.startDate - 1000,
            },
          ],
        },
      };
      expect(() => validateProjectData(invalidData)).toThrow(
        'Milestone 1 date must be within project timeline'
      );
    });
  });

  describe('Comprehensive Risk Data Validation', () => {
    const validRiskData = {
      probability: 70,
      impact: 60,
      severity: 'high', // score = 42, should be medium but we'll test with consistent data
    };

    it('should accept valid risk data', () => {
      // Use consistent data for this test
      const consistentData = { ...validRiskData, probability: 80, impact: 70, severity: 'high' }; // score = 56
      expect(() => validateRiskData(consistentData)).not.toThrow();
    });

    it('should reject invalid probability', () => {
      const invalidData = { ...validRiskData, probability: 150 };
      expect(() => validateRiskData(invalidData)).toThrow('Probability must be between 0 and 100');
    });

    it('should reject invalid impact', () => {
      const invalidData = { ...validRiskData, impact: -10 };
      expect(() => validateRiskData(invalidData)).toThrow('Impact must be between 0 and 100');
    });

    it('should reject inconsistent severity', () => {
      const inconsistentData = { ...validRiskData, probability: 20, impact: 20, severity: 'high' }; // score = 4
      expect(() => validateRiskData(inconsistentData)).toThrow();
    });
  });

  describe('Comprehensive User Data Validation', () => {
    const validUserData = {
      email: 'user@example.com',
      name: 'John Doe',
      department: 'Engineering',
    };

    it('should accept valid user data', () => {
      expect(() => validateUserData(validUserData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = { ...validUserData, email: 'invalid-email' };
      expect(() => validateUserData(invalidData)).toThrow('Invalid email format');
    });

    it('should reject empty name', () => {
      const invalidData = { ...validUserData, name: '' };
      expect(() => validateUserData(invalidData)).toThrow('User name is required');
    });

    it('should reject whitespace-only name', () => {
      const invalidData = { ...validUserData, name: '   ' };
      expect(() => validateUserData(invalidData)).toThrow('User name is required');
    });

    it('should reject empty department', () => {
      const invalidData = { ...validUserData, department: '' };
      expect(() => validateUserData(invalidData)).toThrow('Department is required');
    });

    it('should reject whitespace-only department', () => {
      const invalidData = { ...validUserData, department: '   ' };
      expect(() => validateUserData(invalidData)).toThrow('Department is required');
    });
  });
});
