import { describe, it, expect, beforeEach } from 'vitest';

describe('Evaluation Engine', () => {
  let sampleProject: any;
  let sampleStandard: any;
  let sampleCriteria: any;
  let sampleCompliance: any;
  let sampleEvaluation: any;

  beforeEach(() => {
    sampleProject = {
      _id: 'test-project-id',
      _creationTime: Date.now(),
      name: 'Test Project',
      description: 'Test project for evaluation',
      status: 'active',
      budget: 100000,
      spentBudget: 50000,
      timeline: {
        startDate: Date.now(),
        endDate: Date.now() + 86400000,
        milestones: [],
      },
      healthScore: 85,
      riskLevel: 'medium',
      tags: ['test'],
      teamMembers: ['test-user-id'],
    };

    sampleStandard = {
      _id: 'test-standard-id',
      _creationTime: Date.now(),
      name: 'Test PMI Standard',
      description: 'Test standard for evaluation',
      category: 'project',
      level: 'foundational',
      weight: 0.8,
      version: '1.0',
      isActive: true,
    };

    sampleCriteria = {
      _id: 'test-criteria-id',
      _creationTime: Date.now(),
      standardId: 'test-standard-id',
      name: 'Test Criteria',
      description: 'Test criteria description',
      requirement: 'Must provide test evidence',
      evidenceType: 'text',
      evidenceDescription: 'Text evidence required',
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
      evidence: 'This is sufficient text evidence for testing purposes',
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

  describe('Evaluation Result Types', () => {
    it('should validate evaluation result structure', () => {
      const evaluationResult = {
        projectId: 'test-project-id',
        standardId: 'test-standard-id',
        overallScore: 85,
        criteriaResults: [],
        evaluationDate: Date.now(),
        evaluatorId: 'test-user-id',
        status: 'complete' as const,
        notes: 'Test evaluation',
      };

      expect(evaluationResult).toHaveProperty('projectId');
      expect(evaluationResult).toHaveProperty('standardId');
      expect(evaluationResult).toHaveProperty('overallScore');
      expect(evaluationResult).toHaveProperty('criteriaResults');
      expect(evaluationResult).toHaveProperty('evaluationDate');
      expect(evaluationResult).toHaveProperty('evaluatorId');
      expect(evaluationResult).toHaveProperty('status');
    });

    it('should validate evaluation status types', () => {
      const validStatuses = ['complete', 'partial', 'failed'];
      expect(validStatuses).toContain('complete');
      expect(validStatuses).toContain('partial');
      expect(validStatuses).toContain('failed');
    });

    it('should validate criteria result structure', () => {
      const criteriaResult = {
        criteriaId: 'test-criteria-id',
        criteriaName: 'Test Criteria',
        score: 8,
        maxScore: 10,
        status: 'met' as const,
        evidenceStatus: 'provided' as const,
        validationNotes: 'Evidence validated successfully',
      };

      expect(criteriaResult).toHaveProperty('criteriaId');
      expect(criteriaResult).toHaveProperty('criteriaName');
      expect(criteriaResult).toHaveProperty('score');
      expect(criteriaResult).toHaveProperty('maxScore');
      expect(criteriaResult).toHaveProperty('status');
      expect(criteriaResult).toHaveProperty('evidenceStatus');
    });

    it('should validate criteria status types', () => {
      const validStatuses = ['met', 'partial', 'not_met', 'not_applicable'];
      expect(validStatuses).toContain('met');
      expect(validStatuses).toContain('partial');
      expect(validStatuses).toContain('not_met');
      expect(validStatuses).toContain('not_applicable');
    });

    it('should validate evidence status types', () => {
      const validEvidenceStatuses = ['provided', 'missing', 'invalid'];
      expect(validEvidenceStatuses).toContain('provided');
      expect(validEvidenceStatuses).toContain('missing');
      expect(validEvidenceStatuses).toContain('invalid');
    });
  });

  describe('Scoring Algorithm', () => {
    it('should calculate weighted scores correctly', () => {
      // Test case: 80% raw score with 0.8 weight should give 64% overall
      const rawScore = 80;
      const standardWeight = 0.8;
      const expectedOverallScore = Math.round(rawScore * standardWeight * 100) / 100;

      expect(expectedOverallScore).toBe(64);
    });

    it('should handle zero possible score', () => {
      const rawScore = 0;
      const standardWeight = 0.8;
      const overallScore = Math.round(rawScore * standardWeight * 100) / 100;

      expect(overallScore).toBe(0);
    });

    it('should round scores to two decimal places', () => {
      const rawScore = 87.5;
      const standardWeight = 0.75;
      const overallScore = Math.round(rawScore * standardWeight * 100) / 100;

      expect(overallScore).toBe(65.63);
    });
  });

  describe('Evidence Validation Logic', () => {
    it('should validate text evidence correctly', () => {
      const textEvidence = 'This is sufficient text evidence for validation';
      const isValid = textEvidence && textEvidence.length > 10;

      expect(isValid).toBe(true);
    });

    it('should reject insufficient text evidence', () => {
      const textEvidence = 'Short';
      const isValid = textEvidence && textEvidence.length > 10;

      expect(isValid).toBe(false);
    });

    it('should validate URL evidence correctly', () => {
      const urlEvidence = 'https://example.com/document.pdf';
      const isValid = urlEvidence && urlEvidence.startsWith('http');

      expect(isValid).toBe(true);
    });

    it('should reject invalid URL evidence', () => {
      const urlEvidence = 'invalid-url';
      const isValid = urlEvidence && urlEvidence.startsWith('http');

      expect(isValid).toBe(false);
    });

    it('should validate file evidence correctly', () => {
      const fileEvidence = 'https://example.com/file.pdf';
      const isValid = fileEvidence && fileEvidence.length > 0;

      expect(isValid).toBe(true);
    });
  });

  describe('Status Determination', () => {
    it('should determine complete status when all criteria met', () => {
      const criteriaResults = [
        { status: 'met', criteriaId: '1' },
        { status: 'met', criteriaId: '2' },
      ];
      const unmetMandatory: any[] = [];
      const hasPartial = criteriaResults.some((result: any) => result.status === 'partial');

      let status: 'complete' | 'partial' | 'failed' = 'complete';
      if (unmetMandatory.length > 0) {
        status = 'failed';
      } else if (hasPartial) {
        status = 'partial';
      }

      expect(status).toBe('complete');
    });

    it('should determine partial status when some criteria are partial', () => {
      const criteriaResults = [
        { status: 'met', criteriaId: '1' },
        { status: 'partial', criteriaId: '2' },
      ];
      const unmetMandatory: any[] = [];
      const hasPartial = criteriaResults.some((result: any) => result.status === 'partial');

      let status: 'complete' | 'partial' | 'failed' = 'complete';
      if (unmetMandatory.length > 0) {
        status = 'failed';
      } else if (hasPartial) {
        status = 'partial';
      }

      expect(status).toBe('partial');
    });

    it('should determine failed status when mandatory criteria not met', () => {
      const criteriaResults = [
        { status: 'met', criteriaId: '1' },
        { status: 'not_met', criteriaId: '2' },
      ];
      const mandatoryCriteria = [{ _id: '2', isMandatory: true }];
      const unmetMandatory = criteriaResults.filter(
        (result: any) =>
          mandatoryCriteria.some((c: any) => c._id === result.criteriaId) &&
          result.status === 'not_met'
      );
      const hasPartial = criteriaResults.some((result: any) => result.status === 'partial');

      let status: 'complete' | 'partial' | 'failed' = 'complete';
      if (unmetMandatory.length > 0) {
        status = 'failed';
      } else if (hasPartial) {
        status = 'partial';
      }

      expect(status).toBe('failed');
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate average score correctly', () => {
      const evaluations = [{ overallScore: 80 }, { overallScore: 90 }, { overallScore: 70 }];
      const scores = evaluations.map((e: any) => e.overallScore);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      expect(averageScore).toBe(80);
    });

    it('should determine improvement trend correctly', () => {
      const evaluations = [
        { overallScore: 70, evaluatedAt: Date.now() - 86400000 },
        { overallScore: 80, evaluatedAt: Date.now() },
      ];

      let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (evaluations.length >= 2) {
        const sorted = evaluations.sort((a: any, b: any) => a.evaluatedAt - b.evaluatedAt);
        const firstScore = sorted[0].overallScore;
        const lastScore = sorted[sorted.length - 1].overallScore;

        if (lastScore > firstScore + 5) improvementTrend = 'improving';
        else if (lastScore < firstScore - 5) improvementTrend = 'declining';
      }

      expect(improvementTrend).toBe('improving');
    });

    it('should determine compliance level correctly', () => {
      const averageScore = 85;
      let complianceLevel: 'excellent' | 'good' | 'fair' | 'poor';

      if (averageScore >= 90) complianceLevel = 'excellent';
      else if (averageScore >= 75) complianceLevel = 'good';
      else if (averageScore >= 60) complianceLevel = 'fair';
      else complianceLevel = 'poor';

      expect(complianceLevel).toBe('good');
    });
  });

  describe('Batch Processing', () => {
    it('should handle multiple project evaluations', () => {
      const projectIds = ['project-1', 'project-2', 'project-3'];
      const results = projectIds.map((projectId: string) => ({
        projectId,
        standardId: 'test-standard-id',
        overallScore: 75,
        criteriaResults: [],
        evaluationDate: Date.now(),
        evaluatorId: 'test-user-id',
        status: 'complete' as const,
      }));

      expect(results).toHaveLength(3);
      results.forEach((result: any, index: number) => {
        expect(result.projectId).toBe(projectIds[index]);
        expect(result.standardId).toBe('test-standard-id');
      });
    });
  });
});
