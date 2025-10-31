import { query } from './_generated/server';

// Get compliance statistics for dashboard
export const getComplianceStatistics = query({
  args: {},
  handler: async ctx => {
    // Get all projects
    const projects = await ctx.db.query('projects').collect();

    // Get all compliance evaluations
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    // Get all PMI standards
    const standards = await ctx.db
      .query('pmiStandards')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();

    // Calculate overall compliance
    const totalProjects = projects.length;
    let compliantProjects = 0;
    let nonCompliantProjects = 0;
    let totalComplianceScore = 0;
    let evaluatedProjects = 0;

    // Calculate compliance for each project
    for (const project of projects) {
      const projectEvaluations = evaluations.filter(e => e.projectId === project._id);
      if (projectEvaluations.length > 0) {
        const latestEvaluation = projectEvaluations.reduce((latest, current) =>
          current.evaluatedAt > latest.evaluatedAt ? current : latest
        );

        totalComplianceScore += latestEvaluation.overallScore;
        evaluatedProjects++;

        if (latestEvaluation.overallScore >= 80) {
          compliantProjects++;
        } else if (latestEvaluation.overallScore < 60) {
          nonCompliantProjects++;
        }
      }
    }

    const overallCompliance =
      evaluatedProjects > 0 ? Math.round(totalComplianceScore / evaluatedProjects) : 0;
    const standardsCoverage =
      standards.length > 0
        ? Math.round((standards.filter(s => s.isActive).length / standards.length) * 100)
        : 0;

    // Calculate trend (simple implementation)
    const trend =
      overallCompliance > 70 ? 'improving' : overallCompliance > 50 ? 'stable' : 'declining';
    const trendValue = overallCompliance > 70 ? 5 : overallCompliance > 50 ? 0 : -5;

    return {
      overallCompliance,
      compliantProjects,
      nonCompliantProjects,
      totalProjects,
      standardsCoverage,
      trend,
      trendValue,
    };
  },
});

// Get portfolio-level compliance data
export const getPortfolioCompliance = query({
  args: {},
  handler: async ctx => {
    const portfolios = await ctx.db.query('portfolios').collect();
    const projects = await ctx.db.query('projects').collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    const portfolioCompliance = [];

    for (const portfolio of portfolios) {
      const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
      let portfolioComplianceScore = 0;
      let evaluatedProjects = 0;

      const projectDetails = [];

      for (const project of portfolioProjects) {
        const projectEvaluations = evaluations.filter(e => e.projectId === project._id);
        if (projectEvaluations.length > 0) {
          const latestEvaluation = projectEvaluations.reduce((latest, current) =>
            current.evaluatedAt > latest.evaluatedAt ? current : latest
          );

          portfolioComplianceScore += latestEvaluation.overallScore;
          evaluatedProjects++;

          projectDetails.push({
            name: project.name,
            complianceScore: latestEvaluation.overallScore,
            lastEvaluation: latestEvaluation.evaluatedAt,
            status:
              latestEvaluation.overallScore >= 80
                ? 'Compliant'
                : latestEvaluation.overallScore >= 60
                  ? 'Partial'
                  : 'Non-Compliant',
          });
        }
      }

      const averageScore =
        evaluatedProjects > 0 ? Math.round(portfolioComplianceScore / evaluatedProjects) : 0;

      portfolioCompliance.push({
        portfolioId: portfolio._id,
        portfolioName: portfolio.name,
        complianceScore: averageScore,
        totalProjects: portfolioProjects.length,
        evaluatedProjects,
        projects: projectDetails,
      });
    }

    return portfolioCompliance;
  },
});

// Get compliance trends over time
export const getComplianceTrends = query({
  args: {},
  handler: async ctx => {
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    // Group evaluations by date (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentEvaluations = evaluations.filter(e => e.evaluatedAt >= thirtyDaysAgo);

    // Group by day and calculate average
    const dailyAverages: Record<string, { total: number; count: number }> = {};

    for (const evaluation of recentEvaluations) {
      const date = new Date(evaluation.evaluatedAt).toISOString().split('T')[0];
      if (!dailyAverages[date]) {
        dailyAverages[date] = { total: 0, count: 0 };
      }
      dailyAverages[date].total += evaluation.overallScore;
      dailyAverages[date].count++;
    }

    // Convert to array format
    const trends = Object.entries(dailyAverages)
      .map(([date, data]) => ({
        date,
        complianceScore: Math.round(data.total / data.count),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If no recent data, return some mock data for demonstration
    if (trends.length === 0) {
      const baseDate = Date.now() - 30 * 24 * 60 * 60 * 1000;
      for (let i = 0; i < 7; i++) {
        trends.push({
          date: new Date(baseDate + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          complianceScore: 65 + Math.floor(Math.random() * 20),
        });
      }
    }

    return trends;
  },
});

// Get standards adherence data
export const getStandardsAdherence = query({
  args: {},
  handler: async ctx => {
    const standards = await ctx.db
      .query('pmiStandards')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    const adherence = [];

    for (const standard of standards) {
      const standardEvaluations = evaluations.filter(e => e.standardId === standard._id);

      if (standardEvaluations.length > 0) {
        const totalScore = standardEvaluations.reduce((sum, e) => sum + e.overallScore, 0);
        const averageScore = Math.round(totalScore / standardEvaluations.length);

        adherence.push({
          standardId: standard._id,
          standardName: standard.name,
          complianceRate: averageScore,
          totalEvaluations: standardEvaluations.length,
        });
      } else {
        // Mock data for demonstration
        adherence.push({
          standardId: standard._id,
          standardName: standard.name,
          complianceRate: 50 + Math.floor(Math.random() * 40),
          totalEvaluations: 0,
        });
      }
    }

    return adherence;
  },
});

// Get non-compliance heat map data
export const getNonComplianceHeatmap = query({
  args: {},
  handler: async ctx => {
    const standards = await ctx.db
      .query('pmiStandards')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();

    const heatmap = [];

    for (const standard of standards) {
      const standardEvaluations = evaluations.filter(e => e.standardId === standard._id);
      const nonCompliantEvaluations = standardEvaluations.filter(e => e.overallScore < 60);

      const nonCompliantRate =
        standardEvaluations.length > 0
          ? nonCompliantEvaluations.length / standardEvaluations.length
          : 0.3; // Default to 30% for demo

      heatmap.push({
        standardId: standard._id,
        standardName: standard.name,
        nonCompliantProjects: nonCompliantEvaluations.length,
        intensity: Math.min(nonCompliantRate * 2, 1), // Scale intensity for better visualization
      });
    }

    return heatmap;
  },
});
