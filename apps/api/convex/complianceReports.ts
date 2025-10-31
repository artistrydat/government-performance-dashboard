import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Generate comprehensive compliance report data
export const generateComplianceReportData = query({
  args: {
    portfolioId: v.optional(v.id('portfolios')),
    projectId: v.optional(v.id('projects')),
    reportType: v.union(
      v.literal('executive_summary'),
      v.literal('detailed_breakdown'),
      v.literal('audit_ready')
    ),
  },
  handler: async (ctx, args) => {
    const { portfolioId, projectId, reportType } = args;

    // Get all necessary data
    const projects = await ctx.db.query('projects').collect();
    const portfolios = await ctx.db.query('portfolios').collect();
    const evaluations = await ctx.db.query('complianceEvaluations').collect();
    const standards = await ctx.db
      .query('pmiStandards')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();
    const evidence = await ctx.db.query('evidence').collect();
    const users = await ctx.db.query('users').collect();

    // Filter data based on parameters
    let filteredProjects = projects;
    if (portfolioId) {
      filteredProjects = projects.filter(p => p.portfolioId === portfolioId);
    }
    if (projectId) {
      filteredProjects = projects.filter(p => p._id === projectId);
    }

    // Calculate overall compliance statistics
    const totalProjects = filteredProjects.length;
    let compliantProjects = 0;
    let nonCompliantProjects = 0;
    let totalComplianceScore = 0;
    let evaluatedProjects = 0;

    const projectComplianceDetails = [];

    for (const project of filteredProjects) {
      const projectEvaluations = evaluations.filter(e => e.projectId === project._id);
      if (projectEvaluations.length > 0) {
        const latestEvaluation = projectEvaluations.reduce((latest, current) =>
          current.evaluatedAt > latest.evaluatedAt ? current : latest
        );

        totalComplianceScore += latestEvaluation.overallScore;
        evaluatedProjects++;

        const complianceStatus =
          latestEvaluation.overallScore >= 80
            ? 'Compliant'
            : latestEvaluation.overallScore >= 60
              ? 'Partial'
              : 'Non-Compliant';

        if (complianceStatus === 'Compliant') compliantProjects++;
        if (complianceStatus === 'Non-Compliant') nonCompliantProjects++;

        projectComplianceDetails.push({
          projectId: project._id,
          projectName: project.name,
          complianceScore: latestEvaluation.overallScore,
          status: complianceStatus,
          lastEvaluation: latestEvaluation.evaluatedAt,
          evaluator: users.find(u => u._id === latestEvaluation.evaluatorId)?.name || 'Unknown',
        });
      }
    }

    const overallCompliance =
      evaluatedProjects > 0 ? Math.round(totalComplianceScore / evaluatedProjects) : 0;

    // Calculate standards adherence
    const standardsAdherence = [];
    for (const standard of standards) {
      const standardEvaluations = evaluations.filter(e => e.standardId === standard._id);
      if (standardEvaluations.length > 0) {
        const totalScore = standardEvaluations.reduce((sum, e) => sum + e.overallScore, 0);
        const averageScore = Math.round(totalScore / standardEvaluations.length);

        standardsAdherence.push({
          standardId: standard._id,
          standardName: standard.name,
          category: standard.category,
          complianceRate: averageScore,
          totalEvaluations: standardEvaluations.length,
        });
      }
    }

    // Calculate evidence statistics
    const evidenceStats = {
      totalEvidence: evidence.length,
      approvedEvidence: evidence.filter(e => e.status === 'approved').length,
      pendingReview: evidence.filter(e => e.status === 'submitted' || e.status === 'under_review')
        .length,
      rejectedEvidence: evidence.filter(e => e.status === 'rejected').length,
    };

    // Generate executive summary
    const executiveSummary = {
      overallCompliance,
      totalProjects,
      compliantProjects,
      nonCompliantProjects,
      evaluatedProjects,
      standardsCoverage: standards.length,
      reportGeneratedAt: Date.now(),
      keyFindings: [
        {
          title: 'Overall Compliance Status',
          value: `${overallCompliance}%`,
          status:
            overallCompliance >= 80 ? 'good' : overallCompliance >= 60 ? 'warning' : 'critical',
        },
        {
          title: 'Compliant Projects',
          value: `${compliantProjects} of ${evaluatedProjects}`,
          status: compliantProjects / evaluatedProjects >= 0.8 ? 'good' : 'warning',
        },
        {
          title: 'Standards Coverage',
          value: `${standards.length} active standards`,
          status: 'info',
        },
      ],
    };

    // Generate detailed breakdown
    const detailedBreakdown = {
      projectCompliance: projectComplianceDetails,
      standardsAdherence,
      evidenceStatistics: evidenceStats,
      portfolioBreakdown: portfolios.map(portfolio => {
        const portfolioProjects = projects.filter(p => p.portfolioId === portfolio._id);
        const portfolioEvaluations = evaluations.filter(e =>
          portfolioProjects.some(p => p._id === e.projectId)
        );

        let portfolioScore = 0;
        if (portfolioEvaluations.length > 0) {
          portfolioScore = Math.round(
            portfolioEvaluations.reduce((sum, e) => sum + e.overallScore, 0) /
              portfolioEvaluations.length
          );
        }

        return {
          portfolioId: portfolio._id,
          portfolioName: portfolio.name,
          complianceScore: portfolioScore,
          totalProjects: portfolioProjects.length,
          evaluatedProjects: portfolioEvaluations.length,
        };
      }),
    };

    return {
      executiveSummary,
      detailedBreakdown,
      reportType,
      generatedAt: Date.now(),
      scope: {
        portfolioId,
        projectId,
        totalProjects: filteredProjects.length,
      },
    };
  },
});

// Save report generation request
export const saveReportRequest = mutation({
  args: {
    reportType: v.string(),
    parameters: v.object({
      portfolioId: v.optional(v.id('portfolios')),
      projectId: v.optional(v.id('projects')),
      dateRange: v.optional(
        v.object({
          startDate: v.number(),
          endDate: v.number(),
        })
      ),
    }),
    requestedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { reportType, parameters, requestedBy } = args;

    const reportRequestId = await ctx.db.insert('complianceReportRequests', {
      reportType,
      parameters,
      requestedBy,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return reportRequestId;
  },
});

// Get report generation status
export const getReportStatus = query({
  args: {
    reportRequestId: v.id('complianceReportRequests'),
  },
  handler: async (ctx, args) => {
    const reportRequest = await ctx.db.get(args.reportRequestId);
    return reportRequest;
  },
});

// Schedule recurring reports
export const scheduleRecurringReport = mutation({
  args: {
    reportType: v.string(),
    frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly')),
    recipients: v.array(v.id('users')),
    parameters: v.object({
      portfolioId: v.optional(v.id('portfolios')),
      projectId: v.optional(v.id('projects')),
    }),
    scheduledBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { reportType, frequency, recipients, parameters, scheduledBy } = args;

    // Calculate next run time
    const now = Date.now();
    let nextRunTime = now;
    switch (frequency) {
      case 'daily':
        nextRunTime = now + 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        nextRunTime = now + 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        nextRunTime = now + 30 * 24 * 60 * 60 * 1000;
        break;
    }

    const scheduleId = await ctx.db.insert('complianceReportSchedules', {
      reportType,
      frequency,
      recipients,
      parameters,
      nextRunTime,
      isActive: true,
      scheduledBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return scheduleId;
  },
});
