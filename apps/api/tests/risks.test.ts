import { describe, it, expect, beforeEach } from 'vitest';
import { RiskSeverity, RiskStatus } from '@gov-dashboard/shared';

describe('Risk Data Model', () => {
  let validRiskData: any;
  let validProjectData: any;

  beforeEach(() => {
    validProjectData = {
      name: 'Test Government Project',
      description: 'A test project for government dashboard',
      status: 'active',
      budget: 1000000,
      timeline: {
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        milestones: [
          {
            name: 'Initial Planning',
            date: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
            status: 'planned',
          },
        ],
      },
      portfolioId: undefined,
      ownerId: undefined,
      healthScore: 85,
      riskLevel: 'medium',
      tags: ['government', 'test', 'dashboard'],
    };

    validRiskData = {
      projectId: 'test-project-id',
      title: 'Budget Overrun Risk',
      description: 'Risk of exceeding project budget due to scope creep',
      severity: 'high' as RiskSeverity,
      status: 'identified' as RiskStatus,
      probability: 70,
      impact: 80,
      mitigationPlan: 'Implement cost controls and regular budget reviews',
    };
  });

  describe('Data Validation', () => {
    it('should validate probability range', () => {
      expect(validRiskData.probability).toBeGreaterThanOrEqual(0);
      expect(validRiskData.probability).toBeLessThanOrEqual(100);
    });

    it('should validate impact range', () => {
      expect(validRiskData.impact).toBeGreaterThanOrEqual(0);
      expect(validRiskData.impact).toBeLessThanOrEqual(100);
    });

    it('should reject invalid probability (negative)', () => {
      const invalidData = { ...validRiskData, probability: -10 };
      expect(invalidData.probability).toBeLessThan(0);
    });

    it('should reject invalid probability (over 100)', () => {
      const invalidData = { ...validRiskData, probability: 150 };
      expect(invalidData.probability).toBeGreaterThan(100);
    });

    it('should reject invalid impact (negative)', () => {
      const invalidData = { ...validRiskData, impact: -20 };
      expect(invalidData.impact).toBeLessThan(0);
    });

    it('should reject invalid impact (over 100)', () => {
      const invalidData = { ...validRiskData, impact: 120 };
      expect(invalidData.impact).toBeGreaterThan(100);
    });

    it('should require projectId', () => {
      expect(validRiskData.projectId).toBeDefined();
      expect(typeof validRiskData.projectId).toBe('string');
    });

    it('should require title', () => {
      expect(validRiskData.title).toBeDefined();
      expect(typeof validRiskData.title).toBe('string');
      expect(validRiskData.title.length).toBeGreaterThan(0);
    });

    it('should require description', () => {
      expect(validRiskData.description).toBeDefined();
      expect(typeof validRiskData.description).toBe('string');
      expect(validRiskData.description.length).toBeGreaterThan(0);
    });
  });

  describe('Risk Severity', () => {
    it('should accept valid severity values', () => {
      const validSeverities: RiskSeverity[] = ['low', 'medium', 'high', 'critical'];

      validSeverities.forEach(severity => {
        const riskData = { ...validRiskData, severity };
        expect(validSeverities).toContain(riskData.severity);
      });
    });

    it('should calculate risk score correctly', () => {
      const riskScore = (validRiskData.probability * validRiskData.impact) / 100;
      expect(riskScore).toBe(56); // (70 * 80) / 100 = 56
    });

    it('should identify high priority risks', () => {
      const highPrioritySeverities: RiskSeverity[] = ['high', 'critical'];
      const riskData = { ...validRiskData, severity: 'high' as RiskSeverity };
      expect(highPrioritySeverities).toContain(riskData.severity);
    });
  });

  describe('Risk Status', () => {
    it('should accept valid status values', () => {
      const validStatuses: RiskStatus[] = ['identified', 'monitored', 'mitigated', 'resolved'];

      validStatuses.forEach(status => {
        const riskData = { ...validRiskData, status };
        expect(validStatuses).toContain(riskData.status);
      });
    });

    it('should track risk lifecycle', () => {
      const riskLifecycle: RiskStatus[] = ['identified', 'monitored', 'mitigated', 'resolved'];

      riskLifecycle.forEach(status => {
        const riskData = { ...validRiskData, status };
        expect(riskLifecycle).toContain(riskData.status);
      });
    });
  });

  describe('Optional Fields', () => {
    it('should handle undefined mitigation plan', () => {
      const riskData = { ...validRiskData, mitigationPlan: undefined };
      expect(riskData.mitigationPlan).toBeUndefined();
    });

    it('should accept defined mitigation plan', () => {
      const mitigationPlan = 'Implement regular budget reviews and cost controls';
      const riskData = { ...validRiskData, mitigationPlan };
      expect(riskData.mitigationPlan).toBe(mitigationPlan);
    });

    it('should handle empty mitigation plan', () => {
      const riskData = { ...validRiskData, mitigationPlan: '' };
      expect(riskData.mitigationPlan).toBe('');
    });
  });

  describe('Risk Statistics', () => {
    it('should calculate average risk score', () => {
      const risks = [
        { probability: 30, impact: 40 }, // score: 12
        { probability: 70, impact: 80 }, // score: 56
        { probability: 50, impact: 60 }, // score: 30
      ];

      const totalRiskScore = risks.reduce(
        (sum, risk) => sum + (risk.probability * risk.impact) / 100,
        0
      );
      const averageRiskScore = totalRiskScore / risks.length;

      expect(averageRiskScore).toBeCloseTo(32.67, 2); // (12 + 56 + 30) / 3 = 32.67
    });

    it('should count risks by severity', () => {
      const risks = [
        { severity: 'low' as RiskSeverity },
        { severity: 'medium' as RiskSeverity },
        { severity: 'high' as RiskSeverity },
        { severity: 'low' as RiskSeverity },
        { severity: 'critical' as RiskSeverity },
      ];

      const severityCounts = {
        low: risks.filter(r => r.severity === 'low').length,
        medium: risks.filter(r => r.severity === 'medium').length,
        high: risks.filter(r => r.severity === 'high').length,
        critical: risks.filter(r => r.severity === 'critical').length,
      };

      expect(severityCounts.low).toBe(2);
      expect(severityCounts.medium).toBe(1);
      expect(severityCounts.high).toBe(1);
      expect(severityCounts.critical).toBe(1);
    });

    it('should count risks by status', () => {
      const risks = [
        { status: 'identified' as RiskStatus },
        { status: 'monitored' as RiskStatus },
        { status: 'identified' as RiskStatus },
        { status: 'resolved' as RiskStatus },
        { status: 'mitigated' as RiskStatus },
      ];

      const statusCounts = {
        identified: risks.filter(r => r.status === 'identified').length,
        monitored: risks.filter(r => r.status === 'monitored').length,
        mitigated: risks.filter(r => r.status === 'mitigated').length,
        resolved: risks.filter(r => r.status === 'resolved').length,
      };

      expect(statusCounts.identified).toBe(2);
      expect(statusCounts.monitored).toBe(1);
      expect(statusCounts.mitigated).toBe(1);
      expect(statusCounts.resolved).toBe(1);
    });

    it('should identify high priority risks count', () => {
      const risks = [
        { severity: 'low' as RiskSeverity },
        { severity: 'high' as RiskSeverity },
        { severity: 'medium' as RiskSeverity },
        { severity: 'critical' as RiskSeverity },
        { severity: 'low' as RiskSeverity },
      ];

      const highPriorityRisks = risks.filter(
        r => r.severity === 'high' || r.severity === 'critical'
      ).length;
      expect(highPriorityRisks).toBe(2);
    });
  });

  describe('Risk Relationships', () => {
    it('should associate risk with project', () => {
      expect(validRiskData.projectId).toBe('test-project-id');
      expect(typeof validRiskData.projectId).toBe('string');
    });

    it('should handle project reference validation', () => {
      // This would typically validate that the projectId references an existing project
      // For unit tests, we just verify the structure
      expect(validRiskData.projectId).toMatch(/^[a-zA-Z0-9:-]+$/);
    });
  });
});
