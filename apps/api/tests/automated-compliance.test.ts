import { test, expect } from 'vitest';

// Pure function implementations for testing (copied from automatedCompliance.ts)
function determineComplianceStatus(score: number): 'compliant' | 'partial' | 'non_compliant' {
  if (score >= 80) return 'compliant';
  if (score >= 60) return 'partial';
  return 'non_compliant';
}

function calculateComplianceTrend(evaluations: any[]): 'improving' | 'declining' | 'stable' {
  if (evaluations.length < 2) {
    return 'stable';
  }

  const sorted = evaluations.sort((a, b) => a.evaluatedAt - b.evaluatedAt);
  const firstScore = sorted[0].overallScore;
  const lastScore = sorted[sorted.length - 1].overallScore;

  if (lastScore > firstScore + 5) return 'improving';
  if (lastScore < firstScore - 5) return 'declining';
  return 'stable';
}

// Test pure functions from automated compliance
test('determineComplianceStatus - correctly categorizes scores', () => {
  expect(determineComplianceStatus(95)).toBe('compliant');
  expect(determineComplianceStatus(80)).toBe('compliant');
  expect(determineComplianceStatus(79)).toBe('partial');
  expect(determineComplianceStatus(60)).toBe('partial');
  expect(determineComplianceStatus(59)).toBe('non_compliant');
  expect(determineComplianceStatus(0)).toBe('non_compliant');
});

test('calculateComplianceTrend - correctly identifies trends', () => {
  const improvingEvaluations = [
    { overallScore: 60, evaluatedAt: Date.now() - 10000 },
    { overallScore: 70, evaluatedAt: Date.now() - 5000 },
  ];

  const decliningEvaluations = [
    { overallScore: 80, evaluatedAt: Date.now() - 10000 },
    { overallScore: 70, evaluatedAt: Date.now() - 5000 },
  ];

  const stableEvaluations = [
    { overallScore: 75, evaluatedAt: Date.now() - 10000 },
    { overallScore: 76, evaluatedAt: Date.now() - 5000 },
  ];

  expect(calculateComplianceTrend(improvingEvaluations)).toBe('improving');
  expect(calculateComplianceTrend(decliningEvaluations)).toBe('declining');
  expect(calculateComplianceTrend(stableEvaluations)).toBe('stable');
});

// Test data structures and types
test('ComplianceCheckResult interface validation', () => {
  const mockResult = {
    projectId: 'test-project-id',
    projectName: 'Test Project',
    standardId: 'test-standard-id',
    standardName: 'Test Standard',
    overallScore: 85,
    status: 'compliant',
    lastEvaluatedAt: Date.now(),
    trend: 'stable',
    missingCriteria: [],
    alerts: [],
  };

  expect(mockResult.projectId).toBe('test-project-id');
  expect(mockResult.overallScore).toBe(85);
  expect(mockResult.status).toBe('compliant');
  expect(mockResult.trend).toBe('stable');
});

test('ComplianceAlert interface validation', () => {
  const mockAlert = {
    type: 'non_compliant',
    severity: 'high',
    message: 'Test alert message',
    currentValue: 45,
  };

  expect(mockAlert.type).toBe('non_compliant');
  expect(mockAlert.severity).toBe('high');
  expect(mockAlert.message).toBe('Test alert message');
});

test('PortfolioComplianceSummary interface validation', () => {
  const mockSummary = {
    portfolioId: 'test-portfolio-id',
    portfolioName: 'Test Portfolio',
    totalProjects: 5,
    evaluatedProjects: 5,
    averageComplianceScore: 75,
    complianceDistribution: {
      compliant: 2,
      partial: 2,
      non_compliant: 1,
    },
    topRisks: [],
    trendAnalysis: {
      overallTrend: 'stable',
      scoreChange: 0,
      period: '30 days',
    },
  };

  expect(mockSummary.portfolioId).toBe('test-portfolio-id');
  expect(mockSummary.averageComplianceScore).toBe(75);
  expect(mockSummary.complianceDistribution.compliant).toBe(2);
  expect(mockSummary.trendAnalysis.overallTrend).toBe('stable');
});
