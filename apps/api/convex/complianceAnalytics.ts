import { query } from './_generated/server';

// Get compliance trend analysis with advanced metrics
export const getComplianceTrendAnalysis = query({
  args: {},
  handler: async ctx => {
    const evaluations = await ctx.db.query('complianceEvaluations').collect();
    const projects = await ctx.db.query('projects').collect();

    // Group evaluations by week for trend analysis
    const weeklyTrends: Record<string, { scores: number[]; projects: Set<string> }> = {};

    for (const evaluation of evaluations) {
      const weekStart = getWeekStartDate(evaluation.evaluatedAt);
      if (!weeklyTrends[weekStart]) {
        weeklyTrends[weekStart] = { scores: [], projects: new Set() };
      }
      weeklyTrends[weekStart].scores.push(evaluation.overallScore);
      weeklyTrends[weekStart].projects.add(evaluation.projectId);
    }

    // Calculate trend metrics
    const trendData = Object.entries(weeklyTrends)
      .map(([week, data]) => ({
        week,
        averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        totalEvaluations: data.scores.length,
        uniqueProjects: data.projects.size,
        trendDirection: calculateTrendDirection(data.scores),
        volatility: calculateVolatility(data.scores),
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    // Calculate overall trend metrics
    const allScores = evaluations.map(e => e.overallScore);
    const overallTrend = {
      currentAverage: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length),
      trendDirection: calculateTrendDirection(allScores),
      volatility: calculateVolatility(allScores),
      improvementRate: calculateImprovementRate(trendData),
      consistencyScore: calculateConsistencyScore(allScores),
    };

    return {
      weeklyTrends: trendData,
      overallTrend,
      totalEvaluations: evaluations.length,
      totalProjects: projects.length,
    };
  },
});

// Get standards adherence patterns with clustering
export const getStandardsAdherencePatterns = query({
  args: {},
  handler: async ctx => {
    const standards = await ctx.db
      .query('pmiStandards')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    const patterns = [];

    for (const standard of standards) {
      const standardEvaluations = evaluations.filter(e => e.standardId === standard._id);

      if (standardEvaluations.length > 0) {
        const scores = standardEvaluations.map(e => e.overallScore);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        // Calculate adherence patterns
        const adherenceRate = (averageScore / 100) * 100;
        const consistency = calculateConsistencyScore(scores);
        const difficultyLevel = calculateDifficultyLevel(scores);
        const improvementPotential = 100 - averageScore;

        patterns.push({
          standardId: standard._id,
          standardName: standard.name,
          category: standard.category,
          level: standard.level,
          adherenceRate,
          averageScore,
          totalEvaluations: standardEvaluations.length,
          consistency,
          difficultyLevel,
          improvementPotential,
          patternType: classifyAdherencePattern(adherenceRate, consistency),
          cluster: clusterStandardsByPattern(adherenceRate, consistency, difficultyLevel),
        });
      }
    }

    // Group by patterns for insights
    const patternGroups = patterns.reduce(
      (groups, pattern) => {
        const group = pattern.patternType;
        if (!groups[group]) groups[group] = [];
        groups[group].push(pattern);
        return groups;
      },
      {} as Record<string, typeof patterns>
    );

    return {
      patterns,
      patternGroups,
      insights: generatePatternInsights(patternGroups),
    };
  },
});

// Get risk correlation with compliance analysis
export const getRiskComplianceCorrelation = query({
  args: {},
  handler: async ctx => {
    const projects = await ctx.db.query('projects').collect();
    const risks = await ctx.db.query('risks').collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    const correlationData = [];

    for (const project of projects) {
      const projectRisks = risks.filter(r => r.projectId === project._id);
      const projectEvaluations = evaluations.filter(e => e.projectId === project._id);

      if (projectEvaluations.length > 0 && projectRisks.length > 0) {
        const latestEvaluation = projectEvaluations.reduce((latest, current) =>
          current.evaluatedAt > latest.evaluatedAt ? current : latest
        );

        // Calculate risk metrics
        const riskScore = calculateProjectRiskScore(projectRisks);
        const riskCount = projectRisks.length;
        const highRiskCount = projectRisks.filter(
          r => r.severity === 'high' || r.severity === 'critical'
        ).length;

        correlationData.push({
          projectId: project._id,
          projectName: project.name,
          complianceScore: latestEvaluation.overallScore,
          riskScore,
          riskCount,
          highRiskCount,
          riskSeverity: getRiskSeverityLevel(riskScore),
        });
      }
    }

    // Calculate correlation coefficients
    const complianceScores = correlationData.map(d => d.complianceScore);
    const riskScores = correlationData.map(d => d.riskScore);
    const riskCounts = correlationData.map(d => d.riskCount);

    const correlationMetrics = {
      riskScoreCorrelation: calculateCorrelation(complianceScores, riskScores),
      riskCountCorrelation: calculateCorrelation(complianceScores, riskCounts),
      highRiskCorrelation: calculateCorrelation(
        complianceScores,
        correlationData.map(d => d.highRiskCount)
      ),
      totalDataPoints: correlationData.length,
    };

    return {
      correlationData,
      correlationMetrics,
      insights: generateRiskComplianceInsights(correlationMetrics, correlationData),
    };
  },
});

// Get portfolio comparison analytics
export const getPortfolioComparisonAnalytics = query({
  args: {},
  handler: async ctx => {
    const portfolios = await ctx.db.query('portfolios').collect();
    const projects = await ctx.db.query('projects').collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();
    const risks = await ctx.db.query('risks').collect();

    const portfolioAnalytics = [];

    for (const portfolio of portfolios) {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      const portfolioEvaluations = evaluations.filter(e =>
        portfolioProjects.some(p => p._id === e.projectId)
      );
      const portfolioRisks = risks.filter(r => portfolioProjects.some(p => p._id === r.projectId));

      if (portfolioEvaluations.length > 0) {
        const complianceScores = portfolioEvaluations.map(e => e.overallScore);
        const averageCompliance = Math.round(
          complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length
        );

        const riskScores = portfolioProjects.map(p =>
          calculateProjectRiskScore(portfolioRisks.filter(r => r.projectId === p._id))
        );
        const averageRisk =
          riskScores.length > 0
            ? Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length)
            : 0;

        portfolioAnalytics.push({
          portfolioId: portfolio._id,
          portfolioName: portfolio.name,
          projectCount: portfolioProjects.length,
          evaluatedProjects: new Set(portfolioEvaluations.map(e => e.projectId)).size,
          averageCompliance,
          averageRisk,
          complianceVolatility: calculateVolatility(complianceScores),
          riskVolatility: calculateVolatility(riskScores),
          efficiencyScore: calculatePortfolioEfficiency(portfolioProjects, portfolioEvaluations),
          healthScore: portfolio.healthScore,
          budgetUtilization: calculateBudgetUtilization(portfolioProjects),
          performanceRank: 0, // Will be calculated after
        });
      }
    }

    // Calculate performance ranks
    portfolioAnalytics.sort((a, b) => b.averageCompliance - a.averageCompliance);
    portfolioAnalytics.forEach((portfolio, index) => {
      portfolio.performanceRank = index + 1;
    });

    return {
      portfolioAnalytics,
      comparisonMetrics: generatePortfolioComparisonMetrics(portfolioAnalytics),
      benchmarking: generatePortfolioBenchmarking(portfolioAnalytics),
    };
  },
});

// Get predictive compliance modeling data
export const getPredictiveComplianceModeling = query({
  args: {},
  handler: async ctx => {
    const projects = await ctx.db.query('projects').collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();
    const risks = await ctx.db.query('risks').collect();

    const predictionData = [];

    for (const project of projects) {
      const projectEvaluations = evaluations.filter(e => e.projectId === project._id);
      const projectRisks = risks.filter(r => r.projectId === project._id);

      if (projectEvaluations.length >= 2) {
        // Sort evaluations by date
        const sortedEvaluations = projectEvaluations.sort((a, b) => a.evaluatedAt - b.evaluatedAt);
        const latestEvaluation = sortedEvaluations[sortedEvaluations.length - 1];
        const previousEvaluation = sortedEvaluations[sortedEvaluations.length - 2];

        // Calculate trend
        const trend = latestEvaluation.overallScore - previousEvaluation.overallScore;
        const trendStrength = Math.abs(trend) / 10; // Normalized trend strength

        // Predict future compliance
        const predictedScore = predictFutureCompliance(
          latestEvaluation.overallScore,
          trend,
          projectRisks.length,
          project.healthScore
        );

        const confidence = calculatePredictionConfidence(
          projectEvaluations.length,
          trendStrength,
          projectRisks.length
        );

        predictionData.push({
          projectId: project._id,
          projectName: project.name,
          currentScore: latestEvaluation.overallScore,
          previousScore: previousEvaluation.overallScore,
          trend,
          predictedScore: Math.max(0, Math.min(100, predictedScore)),
          confidence: Math.round(confidence * 100),
          riskFactors: projectRisks.length,
          predictionHorizon: '30 days',
          recommendation: generatePredictionRecommendation(
            predictedScore,
            trend,
            projectRisks.length
          ),
        });
      }
    }

    return {
      predictions: predictionData,
      overallPredictionMetrics: calculatePredictionMetrics(predictionData),
      riskAreas: identifyRiskAreas(predictionData),
    };
  },
});

// Get exportable analytics data
export const getExportableAnalyticsData = query({
  args: {},
  handler: async ctx => {
    // Get all relevant data for export
    const [
      trendAnalysis,
      adherencePatterns,
      riskCorrelation,
      portfolioComparison,
      predictiveModeling,
    ] = await Promise.all([
      ctx.db.query('complianceEvaluations').collect(),
      ctx.db.query('pmiStandards').collect(),
      ctx.db.query('risks').collect(),
      ctx.db.query('portfolios').collect(),
      ctx.db.query('projects').collect(),
    ]);

    // Transform data for export
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        dataVersion: '1.0',
        recordCounts: {
          evaluations: trendAnalysis.length,
          standards: adherencePatterns.length,
          risks: riskCorrelation.length,
          portfolios: portfolioComparison.length,
          projects: predictiveModeling.length,
        },
      },
      trendData: trendAnalysis.map(e => ({
        projectId: e.projectId,
        standardId: e.standardId,
        score: e.overallScore,
        evaluatedAt: new Date(e.evaluatedAt).toISOString(),
        evaluatorId: e.evaluatorId,
      })),
      standardsData: adherencePatterns.map(s => ({
        standardId: s._id,
        name: s.name,
        category: s.category,
        level: s.level,
        weight: s.weight,
        isActive: s.isActive,
      })),
      riskData: riskCorrelation.map(r => ({
        riskId: r._id,
        projectId: r.projectId,
        title: r.title,
        severity: r.severity,
        probability: r.probability,
        status: r.status,
        createdAt: new Date(r.createdAt).toISOString(),
      })),
      portfolioData: portfolioComparison.map(p => ({
        portfolioId: p._id,
        name: p.name,
        healthScore: p.healthScore,
        totalBudget: p.totalBudget,
      })),
      projectData: predictiveModeling.map(p => ({
        projectId: p._id,
        name: p.name,
        status: p.status,
        healthScore: p.healthScore,
        riskLevel: p.riskLevel,
        portfolioId: p.portfolioId,
      })),
    };

    return exportData;
  },
});

// Helper functions

function getWeekStartDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(date.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

function calculateTrendDirection(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 2) return 'stable';

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const difference = secondAvg - firstAvg;

  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

function calculateVolatility(scores: number[]): number {
  if (scores.length < 2) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  return Math.round(Math.sqrt(variance) * 10) / 10; // Standard deviation
}

function calculateImprovementRate(trendData: any[]): number {
  if (trendData.length < 2) return 0;

  const first = trendData[0].averageScore;
  const last = trendData[trendData.length - 1].averageScore;

  return Math.round(((last - first) / first) * 100);
}

function calculateConsistencyScore(scores: number[]): number {
  if (scores.length < 2) return 100;

  const volatility = calculateVolatility(scores);
  return Math.max(0, 100 - volatility * 2); // Higher volatility = lower consistency
}

function calculateDifficultyLevel(scores: number[]): 'low' | 'medium' | 'high' {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (average >= 80) return 'low';
  if (average >= 60) return 'medium';
  return 'high';
}

function classifyAdherencePattern(adherenceRate: number, consistency: number): string {
  if (adherenceRate >= 80 && consistency >= 80) return 'High Performance';
  if (adherenceRate >= 80 && consistency < 80) return 'Inconsistent High';
  if (adherenceRate >= 60 && consistency >= 70) return 'Stable Moderate';
  if (adherenceRate >= 60 && consistency < 70) return 'Volatile Moderate';
  if (adherenceRate >= 40) return 'Low Performance';
  return 'Critical Area';
}

function clusterStandardsByPattern(
  adherenceRate: number,
  consistency: number,
  difficulty: string
): string {
  if (adherenceRate >= 80 && consistency >= 80) return 'Exemplary Standards';
  if (adherenceRate >= 80 && consistency < 80) return 'High Potential Standards';
  if (adherenceRate >= 60 && difficulty === 'low') return 'Foundation Standards';
  if (adherenceRate >= 60 && difficulty === 'high') return 'Challenging Standards';
  if (adherenceRate < 60 && difficulty === 'high') return 'Focus Areas';
  return 'Improvement Opportunities';
}

function generatePatternInsights(patternGroups: Record<string, any[]>): string[] {
  const insights = [];

  if (patternGroups['High Performance']?.length > 0) {
    insights.push(
      `${patternGroups['High Performance'].length} standards are performing excellently with high adherence and consistency`
    );
  }

  if (patternGroups['Critical Area']?.length > 0) {
    insights.push(
      `${patternGroups['Critical Area'].length} standards require immediate attention due to low adherence rates`
    );
  }

  if (patternGroups['Inconsistent High']?.length > 0) {
    insights.push(
      `${patternGroups['Inconsistent High'].length} standards show high potential but need consistency improvements`
    );
  }

  return insights;
}

function calculateProjectRiskScore(risks: any[]): number {
  if (risks.length === 0) return 0;

  const severityWeights = { low: 1, medium: 3, high: 6, critical: 10 };
  const totalWeight = risks.reduce((sum, risk) => {
    return sum + (severityWeights[risk.severity as keyof typeof severityWeights] || 0);
  }, 0);

  return Math.min(100, Math.round((totalWeight / (risks.length * 10)) * 100));
}

function getRiskSeverityLevel(riskScore: number): string {
  if (riskScore >= 80) return 'critical';
  if (riskScore >= 60) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}

function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100) / 100;
}

function generateRiskComplianceInsights(correlationMetrics: any, correlationData: any[]): string[] {
  const insights = [];

  if (correlationMetrics.riskScoreCorrelation < -0.3) {
    insights.push(
      'Strong negative correlation between risk scores and compliance - higher risks significantly impact compliance'
    );
  } else if (correlationMetrics.riskScoreCorrelation > 0.3) {
    insights.push(
      'Unexpected positive correlation - projects with higher risks show better compliance (investigate further)'
    );
  }

  if (correlationMetrics.highRiskCorrelation < -0.5) {
    insights.push('Critical finding: High-risk projects show significantly lower compliance rates');
  }

  const highRiskLowCompliance = correlationData.filter(
    d => d.riskSeverity === 'high' || (d.riskSeverity === 'critical' && d.complianceScore < 60)
  ).length;

  if (highRiskLowCompliance > 0) {
    insights.push(
      `${highRiskLowCompliance} projects have both high risk levels and low compliance - prioritize these for intervention`
    );
  }

  return insights;
}

function calculatePortfolioEfficiency(projects: any[], evaluations: any[]): number {
  const evaluatedProjects = new Set(evaluations.map((e: any) => e.projectId)).size;
  const evaluationRate = evaluatedProjects / projects.length;

  const avgEvaluationTime =
    evaluations.length > 0
      ? evaluations.reduce((sum: number, e: any) => sum + e.overallScore, 0) / evaluations.length
      : 0;

  return Math.round((evaluationRate * 0.4 + (avgEvaluationTime / 100) * 0.6) * 100);
}

function calculateBudgetUtilization(projects: any[]): number {
  if (projects.length === 0) return 0;

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0);

  return totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
}

function generatePortfolioComparisonMetrics(portfolioAnalytics: any[]): any {
  const avgCompliance =
    portfolioAnalytics.reduce((sum, p) => sum + p.averageCompliance, 0) / portfolioAnalytics.length;
  const avgRisk =
    portfolioAnalytics.reduce((sum, p) => sum + p.averageRisk, 0) / portfolioAnalytics.length;
  const avgEfficiency =
    portfolioAnalytics.reduce((sum, p) => sum + p.efficiencyScore, 0) / portfolioAnalytics.length;

  return {
    averageCompliance: Math.round(avgCompliance),
    averageRisk: Math.round(avgRisk),
    averageEfficiency: Math.round(avgEfficiency),
    complianceRange: {
      min: Math.min(...portfolioAnalytics.map(p => p.averageCompliance)),
      max: Math.max(...portfolioAnalytics.map(p => p.averageCompliance)),
    },
    topPerformer: portfolioAnalytics[0]?.portfolioName || 'N/A',
    needsImprovement: portfolioAnalytics[portfolioAnalytics.length - 1]?.portfolioName || 'N/A',
  };
}

function generatePortfolioBenchmarking(portfolioAnalytics: any[]): any {
  const benchmarks = {
    compliance: {
      excellent: 85,
      good: 70,
      needsImprovement: 60,
    },
    efficiency: {
      excellent: 85,
      good: 70,
      needsImprovement: 60,
    },
    risk: {
      low: 30,
      medium: 50,
      high: 70,
    },
  };

  const benchmarkResults = portfolioAnalytics.map(portfolio => {
    const complianceBenchmark =
      portfolio.averageCompliance >= benchmarks.compliance.excellent
        ? 'excellent'
        : portfolio.averageCompliance >= benchmarks.compliance.good
          ? 'good'
          : 'needsImprovement';

    const efficiencyBenchmark =
      portfolio.efficiencyScore >= benchmarks.efficiency.excellent
        ? 'excellent'
        : portfolio.efficiencyScore >= benchmarks.efficiency.good
          ? 'good'
          : 'needsImprovement';

    const riskBenchmark =
      portfolio.averageRisk <= benchmarks.risk.low
        ? 'low'
        : portfolio.averageRisk <= benchmarks.risk.medium
          ? 'medium'
          : 'high';

    return {
      portfolioId: portfolio.portfolioId,
      portfolioName: portfolio.portfolioName,
      complianceBenchmark,
      efficiencyBenchmark,
      riskBenchmark,
      overallBenchmark: calculateOverallBenchmark(
        complianceBenchmark,
        efficiencyBenchmark,
        riskBenchmark
      ),
    };
  });

  return {
    benchmarks,
    results: benchmarkResults,
  };
}

function calculateOverallBenchmark(compliance: string, efficiency: string, risk: string): string {
  const scores = { excellent: 3, good: 2, needsImprovement: 1, low: 3, medium: 2, high: 1 };
  const totalScore =
    (scores[compliance as keyof typeof scores] || 0) +
    (scores[efficiency as keyof typeof scores] || 0) +
    (scores[risk as keyof typeof scores] || 0);

  if (totalScore >= 8) return 'excellent';
  if (totalScore >= 6) return 'good';
  return 'needsImprovement';
}

function predictFutureCompliance(
  currentScore: number,
  trend: number,
  riskCount: number,
  healthScore: number
): number {
  // Simple linear prediction model
  const trendFactor = trend * 0.8; // Trend influence
  const riskFactor = Math.max(0, 10 - riskCount * 2); // Risk influence (negative)
  const healthFactor = healthScore * 0.1; // Health score influence

  return currentScore + trendFactor + riskFactor + healthFactor;
}

function calculatePredictionConfidence(
  evaluationCount: number,
  trendStrength: number,
  riskCount: number
): number {
  const evaluationConfidence = Math.min(1, evaluationCount / 10); // More evaluations = higher confidence
  const trendConfidence = Math.min(1, trendStrength); // Stronger trends = higher confidence
  const riskConfidence = Math.max(0.3, 1 - riskCount / 20); // More risks = lower confidence

  return evaluationConfidence * 0.4 + trendConfidence * 0.4 + riskConfidence * 0.2;
}

function generatePredictionRecommendation(
  predictedScore: number,
  trend: number,
  riskCount: number
): string {
  if (predictedScore >= 80 && trend >= 0) {
    return 'Continue current practices - strong performance expected';
  } else if (predictedScore >= 80 && trend < 0) {
    return 'Monitor closely - high score but declining trend';
  } else if (predictedScore >= 60 && trend >= 0) {
    return 'Focus on incremental improvements - positive momentum';
  } else if (predictedScore >= 60 && trend < 0) {
    return 'Address root causes - declining performance with moderate score';
  } else if (riskCount > 5) {
    return 'Prioritize risk mitigation - high risk factors impacting compliance';
  } else {
    return 'Implement comprehensive improvement plan - significant intervention needed';
  }
}

function calculatePredictionMetrics(predictions: any[]): any {
  const avgPredictedScore =
    predictions.reduce((sum, p) => sum + p.predictedScore, 0) / predictions.length;
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const improvingCount = predictions.filter(p => p.predictedScore > p.currentScore).length;
  const decliningCount = predictions.filter(p => p.predictedScore < p.currentScore).length;

  return {
    averagePredictedScore: Math.round(avgPredictedScore),
    averageConfidence: Math.round(avgConfidence),
    improvingProjects: improvingCount,
    decliningProjects: decliningCount,
    stableProjects: predictions.length - improvingCount - decliningCount,
    improvementRate: Math.round((improvingCount / predictions.length) * 100),
  };
}

function identifyRiskAreas(predictions: any[]): any[] {
  return predictions
    .filter(p => p.predictedScore < 60 || p.confidence < 70)
    .map(p => ({
      projectId: p.projectId,
      projectName: p.projectName,
      riskLevel: p.predictedScore < 50 ? 'critical' : p.predictedScore < 60 ? 'high' : 'medium',
      predictedScore: p.predictedScore,
      confidence: p.confidence,
      recommendation: p.recommendation,
    }))
    .sort((a, b) => a.predictedScore - b.predictedScore);
}
