import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
// Schedule automated compliance evaluations
export const scheduleComplianceEvaluations = mutation({
    args: {
        frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly')),
        portfolioIds: v.optional(v.array(v.id('portfolios'))),
        standardIds: v.optional(v.array(v.id('pmiStandards'))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        // Calculate next evaluation time based on frequency
        let nextEvaluationTime = now;
        switch (args.frequency) {
            case 'daily':
                nextEvaluationTime = now + 24 * 60 * 60 * 1000; // 24 hours
                break;
            case 'weekly':
                nextEvaluationTime = now + 7 * 24 * 60 * 60 * 1000; // 7 days
                break;
            case 'monthly':
                nextEvaluationTime = now + 30 * 24 * 60 * 60 * 1000; // 30 days
                break;
        }
        // Store the schedule configuration
        const scheduleId = await ctx.db.insert('complianceSchedules', {
            frequency: args.frequency,
            portfolioIds: args.portfolioIds || [],
            standardIds: args.standardIds || [],
            nextEvaluationTime,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
        return scheduleId;
    },
});
// Get schedules that are due for evaluation
export const getDueSchedules = query({
    args: { currentTime: v.number() },
    handler: async (ctx, args) => {
        const schedules = await ctx.db
            .query('complianceSchedules')
            .withIndex('by_next_evaluation', (q) => q.lte('nextEvaluationTime', args.currentTime))
            .filter((q) => q.eq(q.field('isActive'), true))
            .collect();
        return schedules;
    },
});
// Update schedule next run time
export const updateScheduleNextRun = mutation({
    args: {
        scheduleId: v.id('complianceSchedules'),
        currentTime: v.number(),
    },
    handler: async (ctx, args) => {
        const schedule = await ctx.db.get(args.scheduleId);
        if (!schedule) {
            throw new Error('Schedule not found');
        }
        let nextEvaluationTime = args.currentTime;
        switch (schedule.frequency) {
            case 'daily':
                nextEvaluationTime = args.currentTime + 24 * 60 * 60 * 1000;
                break;
            case 'weekly':
                nextEvaluationTime = args.currentTime + 7 * 24 * 60 * 60 * 1000;
                break;
            case 'monthly':
                nextEvaluationTime = args.currentTime + 30 * 24 * 60 * 60 * 1000;
                break;
        }
        await ctx.db.patch(args.scheduleId, {
            nextEvaluationTime,
            updatedAt: args.currentTime,
        });
    },
});
// Execute bulk evaluation for multiple portfolios and standards
export const executeBulkEvaluation = mutation({
    args: {
        portfolioIds: v.array(v.id('portfolios')),
        standardIds: v.array(v.id('pmiStandards')),
        evaluatorId: v.string(),
    },
    handler: async (ctx, args) => {
        const results = [];
        // Get all projects from specified portfolios
        const projects = args.portfolioIds.length > 0
            ? await ctx.db
                .query('projects')
                .withIndex('by_portfolio', (q) => q.in('portfolioId', args.portfolioIds))
                .collect()
            : await ctx.db.query('projects').collect();
        for (const project of projects) {
            for (const standardId of args.standardIds) {
                try {
                    const result = await evaluateProjectCompliance(ctx, project._id, standardId);
                    results.push(result);
                    // Generate alerts for non-compliance
                    const alerts = await generateComplianceAlerts(result);
                    if (alerts.length > 0) {
                        await createComplianceNotifications(ctx, project._id, standardId, alerts);
                    }
                }
                catch (error) {
                    console.error(`Failed to evaluate project ${project._id} for standard ${standardId}:`, error);
                }
            }
        }
        return results;
    },
});
// Evaluate project compliance and generate detailed results
async function evaluateProjectCompliance(ctx, projectId, standardId) {
    // Use existing evaluation engine
    const evaluationResult = await ctx.db
        .query('complianceEvaluations')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .filter((q) => q.eq(q.field('standardId'), standardId))
        .order('desc')
        .first();
    const project = await ctx.db.get(projectId);
    const standard = await ctx.db.get(standardId);
    if (!project || !standard) {
        throw new Error('Project or standard not found');
    }
    // Get recent evaluations for trend analysis
    const recentEvaluations = await ctx.db
        .query('complianceEvaluations')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .filter((q) => q.eq(q.field('standardId'), standardId))
        .order('desc')
        .take(5);
    // Calculate trend
    const trend = calculateComplianceTrend(recentEvaluations);
    // Get missing criteria
    const missingCriteria = await getMissingCriteria(ctx, projectId, standardId);
    // Generate alerts
    const alerts = await generateComplianceAlerts({
        projectId,
        projectName: project.name,
        standardId,
        standardName: standard.name,
        overallScore: evaluationResult?.overallScore || 0,
        status: determineComplianceStatus(evaluationResult?.overallScore || 0),
        lastEvaluatedAt: evaluationResult?.evaluatedAt || 0,
        trend,
        missingCriteria,
        alerts: [],
    });
    return {
        projectId,
        projectName: project.name,
        standardId,
        standardName: standard.name,
        overallScore: evaluationResult?.overallScore || 0,
        status: determineComplianceStatus(evaluationResult?.overallScore || 0),
        lastEvaluatedAt: evaluationResult?.evaluatedAt || 0,
        trend,
        missingCriteria,
        alerts,
    };
}
// Calculate compliance trend based on recent evaluations
function calculateComplianceTrend(evaluations) {
    if (evaluations.length < 2) {
        return 'stable';
    }
    const sorted = evaluations.sort((a, b) => a.evaluatedAt - b.evaluatedAt);
    const firstScore = sorted[0].overallScore;
    const lastScore = sorted[sorted.length - 1].overallScore;
    if (lastScore > firstScore + 5)
        return 'improving';
    if (lastScore < firstScore - 5)
        return 'declining';
    return 'stable';
}
// Determine compliance status based on score
function determineComplianceStatus(score) {
    if (score >= 80)
        return 'compliant';
    if (score >= 60)
        return 'partial';
    return 'non_compliant';
}
// Get missing criteria for a project and standard
async function getMissingCriteria(ctx, projectId, standardId) {
    const criteria = await ctx.db
        .query('pmiStandardCriteria')
        .withIndex('by_standard', (q) => q.eq('standardId', standardId))
        .collect();
    const complianceRecords = await ctx.db
        .query('projectCompliance')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .filter((q) => q.eq(q.field('standardId'), standardId))
        .collect();
    const missingCriteria = [];
    for (const criterion of criteria) {
        const hasCompliance = complianceRecords.some((record) => record.criteriaId === criterion._id);
        if (!hasCompliance && criterion.isMandatory) {
            missingCriteria.push(criterion.name);
        }
    }
    return missingCriteria;
}
// Generate compliance alerts based on evaluation results
async function generateComplianceAlerts(result) {
    const alerts = [];
    // Non-compliant alert
    if (result.status === 'non_compliant') {
        alerts.push({
            type: 'non_compliant',
            severity: result.overallScore < 40 ? 'critical' : 'high',
            message: `Project "${result.projectName}" is non-compliant with standard "${result.standardName}" (Score: ${result.overallScore}%)`,
            currentValue: result.overallScore,
        });
    }
    // Declining trend alert
    if (result.trend === 'declining' && result.overallScore < 70) {
        alerts.push({
            type: 'declining_trend',
            severity: 'medium',
            message: `Project "${result.projectName}" shows declining compliance trend with standard "${result.standardName}"`,
            currentValue: result.overallScore,
        });
    }
    // Missing evidence alert
    if (result.missingCriteria.length > 0) {
        alerts.push({
            type: 'missing_evidence',
            severity: result.missingCriteria.length > 3 ? 'high' : 'medium',
            message: `Project "${result.projectName}" missing evidence for ${result.missingCriteria.length} mandatory criteria`,
            currentValue: result.missingCriteria.length,
        });
    }
    // Overdue evaluation alert (if last evaluation was more than 30 days ago)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (result.lastEvaluatedAt < thirtyDaysAgo) {
        alerts.push({
            type: 'overdue_evaluation',
            severity: 'low',
            message: `Project "${result.projectName}" has overdue compliance evaluation for standard "${result.standardName}"`,
            currentValue: Math.floor((Date.now() - result.lastEvaluatedAt) / (24 * 60 * 60 * 1000)),
        });
    }
    return alerts;
}
// Create compliance notifications for users
async function createComplianceNotifications(ctx, projectId, standardId, alerts) {
    const now = Date.now();
    // Get project owner and team members
    const project = await ctx.db.get(projectId);
    if (!project)
        return;
    const recipients = [project.ownerId, ...project.teamMembers];
    for (const recipientId of recipients) {
        for (const alert of alerts) {
            await ctx.db.insert('complianceNotifications', {
                recipientId,
                projectId,
                standardId,
                alertType: alert.type,
                severity: alert.severity,
                message: alert.message,
                isRead: false,
                createdAt: now,
            });
        }
    }
}
// Get real-time compliance status for a project
export const getRealTimeComplianceStatus = query({
    args: { projectId: v.id('projects') },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        const standards = await ctx.db
            .query('pmiStandards')
            .filter((q) => q.eq(q.field('isActive'), true))
            .collect();
        const results = [];
        for (const standard of standards) {
            try {
                const result = await evaluateProjectCompliance(ctx, args.projectId, standard._id);
                results.push(result);
            }
            catch (error) {
                console.error(`Failed to evaluate standard ${standard._id} for project ${args.projectId}:`, error);
            }
        }
        return results;
    },
});
// Get portfolio-level compliance summary
export const getPortfolioComplianceSummary = query({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        const portfolio = await ctx.db.get(args.portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_portfolio', (q) => q.eq('portfolioId', args.portfolioId))
            .collect();
        const standards = await ctx.db
            .query('pmiStandards')
            .filter((q) => q.eq(q.field('isActive'), true))
            .collect();
        let totalScore = 0;
        let evaluationCount = 0;
        const complianceDistribution = {
            compliant: 0,
            partial: 0,
            non_compliant: 0,
        };
        const allAlerts = [];
        for (const project of projects) {
            for (const standard of standards) {
                const evaluation = await ctx.db
                    .query('complianceEvaluations')
                    .withIndex('by_project', (q) => q.eq('projectId', project._id))
                    .filter((q) => q.eq(q.field('standardId'), standard._id))
                    .order('desc')
                    .first();
                if (evaluation) {
                    totalScore += evaluation.overallScore;
                    evaluationCount++;
                    const status = determineComplianceStatus(evaluation.overallScore);
                    complianceDistribution[status]++;
                    // Generate alerts for this evaluation
                    const result = {
                        projectId: project._id,
                        projectName: project.name,
                        standardId: standard._id,
                        standardName: standard.name,
                        overallScore: evaluation.overallScore,
                        status,
                        lastEvaluatedAt: evaluation.evaluatedAt,
                        trend: 'stable', // Simplified for portfolio summary
                        missingCriteria: [],
                        alerts: [],
                    };
                    const alerts = await generateComplianceAlerts(result);
                    allAlerts.push(...alerts);
                }
            }
        }
        const averageScore = evaluationCount > 0 ? totalScore / evaluationCount : 0;
        // Calculate trend (simplified)
        const trendAnalysis = {
            overallTrend: 'stable',
            scoreChange: 0,
            period: '30 days',
        };
        // Get top 5 highest severity alerts
        const topRisks = allAlerts
            .sort((a, b) => {
            const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
        })
            .slice(0, 5);
        return {
            portfolioId: args.portfolioId,
            portfolioName: portfolio.name,
            totalProjects: projects.length,
            evaluatedProjects: evaluationCount,
            averageComplianceScore: Math.round(averageScore * 10) / 10,
            complianceDistribution,
            topRisks,
            trendAnalysis,
        };
    },
});
