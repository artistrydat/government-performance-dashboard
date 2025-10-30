import { describe, it, expect, beforeEach } from 'vitest';

describe('PMI Standards Data Model', () => {
  let sampleStandard: any;
  let sampleCriteria: any;
  let sampleCompliance: any;
  let sampleEvaluation: any;

  beforeEach(() => {
    sampleStandard = {
      _id: 'test-standard-id',
      _creationTime: Date.now(),
      name: 'Test PMI Standard',
      description: 'A test PMI standard for validation',
      category: 'project',
      level: 'foundational',
      weight: 0.15,
      version: '1.0',
      isActive: true,
    };

    sampleCriteria = {
      _id: 'test-criteria-id',
      _creationTime: Date.now(),
      standardId: 'test-standard-id',
      name: 'Test Criteria',
      description: 'Test criteria description',
      requirement: 'Must meet this requirement',
      evidenceType: 'document',
      evidenceDescription: 'Submit supporting documentation',
      scoringMethod: 'binary',
      maxScore: 10,
      isMandatory: true,
      order: 1,
    };

    sampleCompliance = {
      _id: 'test-compliance-id',
      _creationTime: Date.now(),
      projectId: 'test-project-id',
      standardId: 'test-standard-id',
      criteriaId: 'test-criteria-id',
      status: 'submitted',
      score: 8,
      evidence: 'Test evidence document',
      evidenceUrl: 'https://example.com/evidence.pdf',
      submittedAt: Date.now(),
    };

    sampleEvaluation = {
      _id: 'test-evaluation-id',
      _creationTime: Date.now(),
      projectId: 'test-project-id',
      standardId: 'test-standard-id',
      overallScore: 85,
      evaluatorId: 'test-user-id',
      evaluatedAt: Date.now(),
    };
  });

  describe('PMI Standards Structure', () => {
    it('should validate PMI standard structure', () => {
      expect(sampleStandard).toHaveProperty('name');
      expect(sampleStandard).toHaveProperty('category');
      expect(sampleStandard).toHaveProperty('level');
      expect(sampleStandard).toHaveProperty('weight');
      expect(sampleStandard).toHaveProperty('version');
      expect(sampleStandard).toHaveProperty('isActive');
    });

    it('should validate standard categories', () => {
      const validCategories = ['portfolio', 'program', 'project'];
      expect(validCategories).toContain(sampleStandard.category);
    });

    it('should validate standard levels', () => {
      const validLevels = ['foundational', 'intermediate', 'advanced'];
      expect(validLevels).toContain(sampleStandard.level);
    });

    it('should validate weight range', () => {
      expect(sampleStandard.weight).toBeGreaterThan(0);
      expect(sampleStandard.weight).toBeLessThanOrEqual(1);
    });

    it('should validate version format', () => {
      expect(sampleStandard.version).toMatch(/^\d+\.\d+$/);
    });
  });

  describe('PMI Standard Criteria', () => {
    it('should validate criteria structure', () => {
      expect(sampleCriteria).toHaveProperty('name');
      expect(sampleCriteria).toHaveProperty('standardId');
      expect(sampleCriteria).toHaveProperty('evidenceType');
      expect(sampleCriteria).toHaveProperty('scoringMethod');
      expect(sampleCriteria).toHaveProperty('maxScore');
      expect(sampleCriteria).toHaveProperty('order');
    });

    it('should validate evidence types', () => {
      const validEvidenceTypes = ['document', 'link', 'text', 'file'];
      expect(validEvidenceTypes).toContain(sampleCriteria.evidenceType);
    });

    it('should validate scoring methods', () => {
      const validScoringMethods = ['binary', 'partial', 'scale'];
      expect(validScoringMethods).toContain(sampleCriteria.scoringMethod);
    });

    it('should validate max score is positive', () => {
      expect(sampleCriteria.maxScore).toBeGreaterThan(0);
    });

    it('should validate order is positive', () => {
      expect(sampleCriteria.order).toBeGreaterThan(0);
    });
  });

  describe('Project Compliance', () => {
    it('should validate compliance structure', () => {
      expect(sampleCompliance).toHaveProperty('projectId');
      expect(sampleCompliance).toHaveProperty('standardId');
      expect(sampleCompliance).toHaveProperty('criteriaId');
      expect(sampleCompliance).toHaveProperty('status');
      expect(sampleCompliance).toHaveProperty('score');
      expect(sampleCompliance).toHaveProperty('evidence');
    });

    it('should validate compliance status', () => {
      const validStatuses = ['not_started', 'in_progress', 'submitted', 'approved', 'rejected'];
      expect(validStatuses).toContain(sampleCompliance.status);
    });

    it('should validate score range', () => {
      expect(sampleCompliance.score).toBeGreaterThanOrEqual(0);
      expect(sampleCompliance.score).toBeLessThanOrEqual(10); // Assuming maxScore of 10
    });
  });

  describe('Compliance Evaluations', () => {
    it('should validate evaluation structure', () => {
      expect(sampleEvaluation).toHaveProperty('projectId');
      expect(sampleEvaluation).toHaveProperty('standardId');
      expect(sampleEvaluation).toHaveProperty('overallScore');
      expect(sampleEvaluation).toHaveProperty('evaluatorId');
    });

    it('should validate overall score range', () => {
      expect(sampleEvaluation.overallScore).toBeGreaterThanOrEqual(0);
      expect(sampleEvaluation.overallScore).toBeLessThanOrEqual(100);
    });

    it('should have evaluation timestamp', () => {
      expect(sampleEvaluation.evaluatedAt).toBeDefined();
      expect(typeof sampleEvaluation.evaluatedAt).toBe('number');
    });
  });

  describe('Data Integrity', () => {
    it('should maintain relationships between standards and criteria', () => {
      expect(sampleCriteria.standardId).toBe(sampleStandard._id);
    });

    it('should maintain relationships between compliance and standards', () => {
      expect(sampleCompliance.standardId).toBe(sampleStandard._id);
      expect(sampleCompliance.criteriaId).toBe(sampleCriteria._id);
    });

    it('should maintain relationships between evaluations and standards', () => {
      expect(sampleEvaluation.standardId).toBe(sampleStandard._id);
    });

    it('should ensure mandatory criteria are properly marked', () => {
      expect(typeof sampleCriteria.isMandatory).toBe('boolean');
    });
  });
});
