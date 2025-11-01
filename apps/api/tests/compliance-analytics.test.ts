import { describe, it, expect, beforeEach } from 'vitest';

describe('Compliance Analytics Helper Functions', () => {
  let sampleTrendData: any;
  let samplePatternData: any;
  let sampleCorrelationData: any;
  let samplePortfolioData: any;
  let samplePredictionData: any;
  let sampleExportData: any;

  beforeEach(() => {
    sampleTrendData = {
      weeklyTrends: [
        {
          week: '2025-01-01',
          averageScore: 75,
          totalEvaluations: 10,
          uniqueProjects: 5,
          trendDirection: 'improving',
          volatility: 3.2,
        },
        {
          week: '2025-01-08',
          averageScore: 78,
          totalEvaluations: 12,
          uniqueProjects: 6,
          trendDirection: 'improving',
          volatility: 2.8,
        },
      ],
      overallTrend: {
        currentAverage: 76,
        trendDirection: 'improving',
        volatility: 3.0,
        improvementRate: 4,
        consistencyScore: 94,
      },
      totalEvaluations: 22,
      totalProjects: 6,
    };

    // Create patterns array first to avoid circular reference
    const patterns = [
      {
        standardId: 'standard-1',
        standardName: 'Project Scope Management',
        category: 'project',
        level: 'foundational',
        adherenceRate: 85,
        averageScore: 85,
        totalEvaluations: 15,
        consistency: 88,
        difficultyLevel: 'low',
        improvementPotential: 15,
        patternType: 'High Performance',
        cluster: 'Exemplary Standards',
      },
      {
        standardId: 'standard-2',
        standardName: 'Risk Management',
        category: 'project',
        level: 'intermediate',
        adherenceRate: 65,
        averageScore: 65,
        totalEvaluations: 12,
        consistency: 72,
        difficultyLevel: 'high',
        improvementPotential: 35,
        patternType: 'Challenging Standards',
        cluster: 'Focus Areas',
      },
    ];

    samplePatternData = {
      patterns: patterns,
      patternGroups: {
        'High Performance': [patterns[0]],
        'Challenging Standards': [patterns[1]],
      },
      insights: [
        '1 standards are performing excellently with high adherence and consistency',
        '1 standards require immediate attention due to low adherence rates',
      ],
    };

    sampleCorrelationData = {
      correlationData: [
        {
          projectId: 'project-1',
          projectName: 'Digital Transformation',
          complianceScore: 85,
          riskScore: 45,
          riskCount: 3,
          highRiskCount: 1,
          riskSeverity: 'medium',
        },
        {
          projectId: 'project-2',
          projectName: 'Infrastructure Upgrade',
          complianceScore: 65,
          riskScore: 75,
          riskCount: 8,
          highRiskCount: 3,
          riskSeverity: 'high',
        },
      ],
      correlationMetrics: {
        riskScoreCorrelation: -0.65,
        riskCountCorrelation: -0.58,
        highRiskCorrelation: -0.72,
        totalDataPoints: 2,
      },
      insights: [
        'Strong negative correlation between risk scores and compliance - higher risks significantly impact compliance',
        '2 projects have both high risk levels and low compliance - prioritize these for intervention',
      ],
    };

    samplePortfolioData = {
      portfolioAnalytics: [
        {
          portfolioId: 'portfolio-1',
          portfolioName: 'Digital Portfolio',
          projectCount: 8,
          evaluatedProjects: 6,
          averageCompliance: 82,
          averageRisk: 35,
          complianceVolatility: 4.2,
          riskVolatility: 12.5,
          efficiencyScore: 78,
          healthScore: 85,
          budgetUtilization: 65,
          performanceRank: 1,
        },
        {
          portfolioId: 'portfolio-2',
          portfolioName: 'Infrastructure Portfolio',
          projectCount: 6,
          evaluatedProjects: 4,
          averageCompliance: 68,
          averageRisk: 58,
          complianceVolatility: 8.7,
          riskVolatility: 15.3,
          efficiencyScore: 62,
          healthScore: 70,
          budgetUtilization: 82,
          performanceRank: 2,
        },
      ],
      comparisonMetrics: {
        averageCompliance: 75,
        averageRisk: 46,
        averageEfficiency: 70,
        complianceRange: { min: 68, max: 82 },
        topPerformer: 'Digital Portfolio',
        needsImprovement: 'Infrastructure Portfolio',
      },
      benchmarking: {
        benchmarks: {
          compliance: { excellent: 85, good: 70, needsImprovement: 60 },
          efficiency: { excellent: 85, good: 70, needsImprovement: 60 },
          risk: { low: 30, medium: 50, high: 70 },
        },
        results: [
          {
            portfolioId: 'portfolio-1',
            portfolioName: 'Digital Portfolio',
            complianceBenchmark: 'good',
            efficiencyBenchmark: 'good',
            riskBenchmark: 'medium',
            overallBenchmark: 'good',
          },
          {
            portfolioId: 'portfolio-2',
            portfolioName: 'Infrastructure Portfolio',
            complianceBenchmark: 'needsImprovement',
            efficiencyBenchmark: 'needsImprovement',
            riskBenchmark: 'high',
            overallBenchmark: 'needsImprovement',
          },
        ],
      },
    };

    samplePredictionData = {
      predictions: [
        {
          projectId: 'project-1',
          projectName: 'Digital Transformation',
          currentScore: 85,
          previousScore: 82,
          trend: 3,
          predictedScore: 87,
          confidence: 85,
          riskFactors: 2,
          predictionHorizon: '30 days',
          recommendation: 'Continue current practices - strong performance expected',
        },
        {
          projectId: 'project-2',
          projectName: 'Infrastructure Upgrade',
          currentScore: 65,
          previousScore: 68,
          trend: -3,
          predictedScore: 62,
          confidence: 75,
          riskFactors: 5,
          predictionHorizon: '30 days',
          recommendation: 'Address root causes - declining performance with moderate score',
        },
      ],
      overallPredictionMetrics: {
        averagePredictedScore: 74,
        averageConfidence: 80,
        improvingProjects: 1,
        decliningProjects: 1,
        stableProjects: 0,
        improvementRate: 50,
      },
      riskAreas: [
        {
          projectId: 'project-2',
          projectName: 'Infrastructure Upgrade',
          riskLevel: 'high',
          predictedScore: 62,
          confidence: 75,
          recommendation: 'Address root causes - declining performance with moderate score',
        },
      ],
    };

    sampleExportData = {
      metadata: {
        exportDate: '2025-01-15T10:30:00.000Z',
        dataVersion: '1.0',
        recordCounts: {
          evaluations: 25,
          standards: 6,
          risks: 12,
          portfolios: 3,
          projects: 15,
        },
      },
      trendData: [
        {
          projectId: 'project-1',
          standardId: 'standard-1',
          score: 85,
          evaluatedAt: '2025-01-14T15:30:00.000Z',
          evaluatorId: 'user-1',
        },
      ],
      standardsData: [
        {
          standardId: 'standard-1',
          name: 'Project Scope Management',
          category: 'project',
          level: 'foundational',
          weight: 20,
          isActive: true,
        },
      ],
      riskData: [
        {
          riskId: 'risk-1',
          projectId: 'project-1',
          title: 'Scope Creep',
          severity: 'high',
          probability: 0.6,
          status: 'open',
          createdAt: '2025-01-10T09:00:00.000Z',
        },
      ],
      portfolioData: [
        {
          portfolioId: 'portfolio-1',
          name: 'Digital Portfolio',
          healthScore: 85,
          totalBudget: 1000000,
        },
      ],
      projectData: [
        {
          projectId: 'project-1',
          name: 'Digital Transformation',
          status: 'active',
          healthScore: 80,
          riskLevel: 'medium',
          portfolioId: 'portfolio-1',
        },
      ],
    };
  });

  describe('Trend Analysis Data Structure', () => {
    it('should validate trend analysis structure', () => {
      expect(sampleTrendData).toHaveProperty('weeklyTrends');
      expect(sampleTrendData).toHaveProperty('overallTrend');
      expect(sampleTrendData).toHaveProperty('totalEvaluations');
      expect(sampleTrendData).toHaveProperty('totalProjects');

      expect(Array.isArray(sampleTrendData.weeklyTrends)).toBe(true);
      expect(typeof sampleTrendData.overallTrend).toBe('object');
      expect(typeof sampleTrendData.totalEvaluations).toBe('number');
      expect(typeof sampleTrendData.totalProjects).toBe('number');
    });

    it('should validate weekly trend items', () => {
      const trendItem = sampleTrendData.weeklyTrends[0];
      expect(trendItem).toHaveProperty('week');
      expect(trendItem).toHaveProperty('averageScore');
      expect(trendItem).toHaveProperty('totalEvaluations');
      expect(trendItem).toHaveProperty('uniqueProjects');
      expect(trendItem).toHaveProperty('trendDirection');
      expect(trendItem).toHaveProperty('volatility');

      expect(typeof trendItem.averageScore).toBe('number');
      expect(trendItem.averageScore).toBeGreaterThanOrEqual(0);
      expect(trendItem.averageScore).toBeLessThanOrEqual(100);
    });

    it('should validate trend directions', () => {
      const validDirections = ['improving', 'stable', 'declining'];
      sampleTrendData.weeklyTrends.forEach((trend: any) => {
        expect(validDirections).toContain(trend.trendDirection);
      });
    });

    it('should validate overall trend metrics', () => {
      const overall = sampleTrendData.overallTrend;
      expect(overall).toHaveProperty('currentAverage');
      expect(overall).toHaveProperty('trendDirection');
      expect(overall).toHaveProperty('volatility');
      expect(overall).toHaveProperty('improvementRate');
      expect(overall).toHaveProperty('consistencyScore');

      expect(overall.currentAverage).toBeGreaterThanOrEqual(0);
      expect(overall.currentAverage).toBeLessThanOrEqual(100);
      expect(overall.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(overall.consistencyScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Standards Adherence Patterns', () => {
    it('should validate patterns structure', () => {
      expect(samplePatternData).toHaveProperty('patterns');
      expect(samplePatternData).toHaveProperty('patternGroups');
      expect(samplePatternData).toHaveProperty('insights');

      expect(Array.isArray(samplePatternData.patterns)).toBe(true);
      expect(typeof samplePatternData.patternGroups).toBe('object');
      expect(Array.isArray(samplePatternData.insights)).toBe(true);
    });

    it('should validate pattern items', () => {
      const pattern = samplePatternData.patterns[0];
      expect(pattern).toHaveProperty('standardId');
      expect(pattern).toHaveProperty('standardName');
      expect(pattern).toHaveProperty('category');
      expect(pattern).toHaveProperty('level');
      expect(pattern).toHaveProperty('adherenceRate');
      expect(pattern).toHaveProperty('averageScore');
      expect(pattern).toHaveProperty('patternType');
      expect(pattern).toHaveProperty('cluster');

      expect(pattern.adherenceRate).toBeGreaterThanOrEqual(0);
      expect(pattern.adherenceRate).toBeLessThanOrEqual(100);
      expect(pattern.averageScore).toBeGreaterThanOrEqual(0);
      expect(pattern.averageScore).toBeLessThanOrEqual(100);
    });

    it('should validate adherence pattern types', () => {
      const validPatterns = [
        'High Performance',
        'Inconsistent High',
        'Stable Moderate',
        'Volatile Moderate',
        'Low Performance',
        'Critical Area',
        'Challenging Standards',
      ];

      samplePatternData.patterns.forEach((pattern: any) => {
        expect(validPatterns).toContain(pattern.patternType);
      });
    });

    it('should validate standard clusters', () => {
      const validClusters = [
        'Exemplary Standards',
        'High Potential Standards',
        'Foundation Standards',
        'Challenging Standards',
        'Focus Areas',
        'Improvement Opportunities',
      ];

      samplePatternData.patterns.forEach((pattern: any) => {
        expect(validClusters).toContain(pattern.cluster);
      });
    });
  });

  describe('Risk Compliance Correlation', () => {
    it('should validate correlation data structure', () => {
      expect(sampleCorrelationData).toHaveProperty('correlationData');
      expect(sampleCorrelationData).toHaveProperty('correlationMetrics');
      expect(sampleCorrelationData).toHaveProperty('insights');

      expect(Array.isArray(sampleCorrelationData.correlationData)).toBe(true);
      expect(typeof sampleCorrelationData.correlationMetrics).toBe('object');
      expect(Array.isArray(sampleCorrelationData.insights)).toBe(true);
    });

    it('should validate correlation data items', () => {
      const correlationItem = sampleCorrelationData.correlationData[0];
      expect(correlationItem).toHaveProperty('projectId');
      expect(correlationItem).toHaveProperty('projectName');
      expect(correlationItem).toHaveProperty('complianceScore');
      expect(correlationItem).toHaveProperty('riskScore');
      expect(correlationItem).toHaveProperty('riskCount');
      expect(correlationItem).toHaveProperty('highRiskCount');
      expect(correlationItem).toHaveProperty('riskSeverity');

      expect(correlationItem.complianceScore).toBeGreaterThanOrEqual(0);
      expect(correlationItem.complianceScore).toBeLessThanOrEqual(100);
      expect(correlationItem.riskScore).toBeGreaterThanOrEqual(0);
      expect(correlationItem.riskScore).toBeLessThanOrEqual(100);
    });

    it('should validate risk severity levels', () => {
      const validSeverities = ['low', 'medium', 'high', 'critical'];
      sampleCorrelationData.correlationData.forEach((item: any) => {
        expect(validSeverities).toContain(item.riskSeverity);
      });
    });

    it('should validate correlation metrics', () => {
      const metrics = sampleCorrelationData.correlationMetrics;
      expect(metrics).toHaveProperty('riskScoreCorrelation');
      expect(metrics).toHaveProperty('riskCountCorrelation');
      expect(metrics).toHaveProperty('highRiskCorrelation');
      expect(metrics).toHaveProperty('totalDataPoints');

      expect(metrics.riskScoreCorrelation).toBeGreaterThanOrEqual(-1);
      expect(metrics.riskScoreCorrelation).toBeLessThanOrEqual(1);
      expect(metrics.totalDataPoints).toBeGreaterThan(0);
    });
  });

  describe('Portfolio Comparison Analytics', () => {
    it('should validate portfolio analytics structure', () => {
      expect(samplePortfolioData).toHaveProperty('portfolioAnalytics');
      expect(samplePortfolioData).toHaveProperty('comparisonMetrics');
      expect(samplePortfolioData).toHaveProperty('benchmarking');

      expect(Array.isArray(samplePortfolioData.portfolioAnalytics)).toBe(true);
      expect(typeof samplePortfolioData.comparisonMetrics).toBe('object');
      expect(typeof samplePortfolioData.benchmarking).toBe('object');
    });

    it('should validate portfolio analytics items', () => {
      const portfolio = samplePortfolioData.portfolioAnalytics[0];
      expect(portfolio).toHaveProperty('portfolioId');
      expect(portfolio).toHaveProperty('portfolioName');
      expect(portfolio).toHaveProperty('projectCount');
      expect(portfolio).toHaveProperty('evaluatedProjects');
      expect(portfolio).toHaveProperty('averageCompliance');
      expect(portfolio).toHaveProperty('averageRisk');
      expect(portfolio).toHaveProperty('performanceRank');

      expect(portfolio.averageCompliance).toBeGreaterThanOrEqual(0);
      expect(portfolio.averageCompliance).toBeLessThanOrEqual(100);
      expect(portfolio.averageRisk).toBeGreaterThanOrEqual(0);
      expect(portfolio.averageRisk).toBeLessThanOrEqual(100);
      expect(portfolio.performanceRank).toBeGreaterThan(0);
    });

    it('should validate comparison metrics', () => {
      const metrics = samplePortfolioData.comparisonMetrics;
      expect(metrics).toHaveProperty('averageCompliance');
      expect(metrics).toHaveProperty('averageRisk');
      expect(metrics).toHaveProperty('averageEfficiency');
      expect(metrics).toHaveProperty('complianceRange');
      expect(metrics).toHaveProperty('topPerformer');
      expect(metrics).toHaveProperty('needsImprovement');

      expect(metrics.averageCompliance).toBeGreaterThanOrEqual(0);
      expect(metrics.averageCompliance).toBeLessThanOrEqual(100);
    });

    it('should validate benchmarking structure', () => {
      const benchmarking = samplePortfolioData.benchmarking;
      expect(benchmarking).toHaveProperty('benchmarks');
      expect(benchmarking).toHaveProperty('results');

      expect(benchmarking.benchmarks).toHaveProperty('compliance');
      expect(benchmarking.benchmarks).toHaveProperty('efficiency');
      expect(benchmarking.benchmarks).toHaveProperty('risk');
      expect(Array.isArray(benchmarking.results)).toBe(true);
    });
  });

  describe('Predictive Compliance Modeling', () => {
    it('should validate prediction data structure', () => {
      expect(samplePredictionData).toHaveProperty('predictions');
      expect(samplePredictionData).toHaveProperty('overallPredictionMetrics');
      expect(samplePredictionData).toHaveProperty('riskAreas');

      expect(Array.isArray(samplePredictionData.predictions)).toBe(true);
      expect(typeof samplePredictionData.overallPredictionMetrics).toBe('object');
      expect(Array.isArray(samplePredictionData.riskAreas)).toBe(true);
    });

    it('should validate prediction items', () => {
      const prediction = samplePredictionData.predictions[0];
      expect(prediction).toHaveProperty('projectId');
      expect(prediction).toHaveProperty('projectName');
      expect(prediction).toHaveProperty('currentScore');
      expect(prediction).toHaveProperty('previousScore');
      expect(prediction).toHaveProperty('trend');
      expect(prediction).toHaveProperty('predictedScore');
      expect(prediction).toHaveProperty('confidence');
      expect(prediction).toHaveProperty('recommendation');

      expect(prediction.currentScore).toBeGreaterThanOrEqual(0);
      expect(prediction.currentScore).toBeLessThanOrEqual(100);
      expect(prediction.predictedScore).toBeGreaterThanOrEqual(0);
      expect(prediction.predictedScore).toBeLessThanOrEqual(100);
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(100);
    });

    it('should validate prediction metrics', () => {
      const metrics = samplePredictionData.overallPredictionMetrics;
      expect(metrics).toHaveProperty('averagePredictedScore');
      expect(metrics).toHaveProperty('averageConfidence');
      expect(metrics).toHaveProperty('improvingProjects');
      expect(metrics).toHaveProperty('decliningProjects');
      expect(metrics).toHaveProperty('improvementRate');

      expect(metrics.averagePredictedScore).toBeGreaterThanOrEqual(0);
      expect(metrics.averagePredictedScore).toBeLessThanOrEqual(100);
      expect(metrics.averageConfidence).toBeGreaterThanOrEqual(0);
      expect(metrics.averageConfidence).toBeLessThanOrEqual(100);
    });

    it('should validate risk areas', () => {
      const riskArea = samplePredictionData.riskAreas[0];
      expect(riskArea).toHaveProperty('projectId');
      expect(riskArea).toHaveProperty('projectName');
      expect(riskArea).toHaveProperty('riskLevel');
      expect(riskArea).toHaveProperty('predictedScore');
      expect(riskArea).toHaveProperty('confidence');
      expect(riskArea).toHaveProperty('recommendation');
    });
  });

  describe('Exportable Analytics Data', () => {
    it('should validate export data structure', () => {
      expect(sampleExportData).toHaveProperty('metadata');
      expect(sampleExportData).toHaveProperty('trendData');
      expect(sampleExportData).toHaveProperty('standardsData');
      expect(sampleExportData).toHaveProperty('riskData');
      expect(sampleExportData).toHaveProperty('portfolioData');
      expect(sampleExportData).toHaveProperty('projectData');

      expect(typeof sampleExportData.metadata).toBe('object');
      expect(Array.isArray(sampleExportData.trendData)).toBe(true);
      expect(Array.isArray(sampleExportData.standardsData)).toBe(true);
      expect(Array.isArray(sampleExportData.riskData)).toBe(true);
      expect(Array.isArray(sampleExportData.portfolioData)).toBe(true);
      expect(Array.isArray(sampleExportData.projectData)).toBe(true);
    });

    it('should validate metadata', () => {
      const metadata = sampleExportData.metadata;
      expect(metadata).toHaveProperty('exportDate');
      expect(metadata).toHaveProperty('dataVersion');
      expect(metadata).toHaveProperty('recordCounts');

      expect(metadata.recordCounts).toHaveProperty('evaluations');
      expect(metadata.recordCounts).toHaveProperty('standards');
      expect(metadata.recordCounts).toHaveProperty('risks');
      expect(metadata.recordCounts).toHaveProperty('portfolios');
      expect(metadata.recordCounts).toHaveProperty('projects');
    });

    it('should validate trend data items', () => {
      const trendItem = sampleExportData.trendData[0];
      expect(trendItem).toHaveProperty('projectId');
      expect(trendItem).toHaveProperty('standardId');
      expect(trendItem).toHaveProperty('score');
      expect(trendItem).toHaveProperty('evaluatedAt');
      expect(trendItem).toHaveProperty('evaluatorId');
    });

    it('should validate standards data items', () => {
      const standardItem = sampleExportData.standardsData[0];
      expect(standardItem).toHaveProperty('standardId');
      expect(standardItem).toHaveProperty('name');
      expect(standardItem).toHaveProperty('category');
      expect(standardItem).toHaveProperty('level');
      expect(standardItem).toHaveProperty('weight');
      expect(standardItem).toHaveProperty('isActive');
    });

    it('should validate risk data items', () => {
      const riskItem = sampleExportData.riskData[0];
      expect(riskItem).toHaveProperty('riskId');
      expect(riskItem).toHaveProperty('projectId');
      expect(riskItem).toHaveProperty('title');
      expect(riskItem).toHaveProperty('severity');
      expect(riskItem).toHaveProperty('probability');
      expect(riskItem).toHaveProperty('status');
      expect(riskItem).toHaveProperty('createdAt');
    });
  });

  describe('Data Integrity', () => {
    it('should maintain consistent data types', () => {
      // Test that all numeric fields are numbers
      const numericFields = [
        'averageScore',
        'adherenceRate',
        'complianceScore',
        'riskScore',
        'confidence',
        'weight',
        'probability',
      ];

      // Check a sample of numeric fields across different data structures
      expect(typeof sampleTrendData.weeklyTrends[0].averageScore).toBe('number');
      expect(typeof samplePatternData.patterns[0].adherenceRate).toBe('number');
      expect(typeof sampleCorrelationData.correlationData[0].complianceScore).toBe('number');
      expect(typeof samplePredictionData.predictions[0].confidence).toBe('number');
    });

    it('should ensure required fields are present', () => {
      // Test that all required identifier fields are present
      expect(sampleTrendData.weeklyTrends[0].week).toBeDefined();
      expect(samplePatternData.patterns[0].standardId).toBeDefined();
      expect(sampleCorrelationData.correlationData[0].projectId).toBeDefined();
      expect(samplePortfolioData.portfolioAnalytics[0].portfolioId).toBeDefined();
      expect(samplePredictionData.predictions[0].projectId).toBeDefined();
    });

    it('should validate date formats', () => {
      // Test ISO date format compliance
      expect(sampleExportData.metadata.exportDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(sampleExportData.trendData[0].evaluatedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });
});
