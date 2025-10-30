import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get recent compliance evaluations
export const listRecent = query({
  args: {},
  handler: async ctx => {
    const evaluations = await ctx.db.query('complianceEvaluations').order('desc').take(50); // Get the 50 most recent evaluations
    return evaluations;
  },
});

// Get compliance evaluations by project
export const getByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const evaluations = await ctx.db
      .query('complianceEvaluations')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();
    return evaluations;
  },
});

// Get compliance evaluations by standard
export const getByStandard = query({
  args: { standardId: v.id('pmiStandards') },
  handler: async (ctx, args) => {
    const evaluations = await ctx.db
      .query('complianceEvaluations')
      .withIndex('by_standard', q => q.eq('standardId', args.standardId))
      .collect();
    return evaluations;
  },
});

// Create a new compliance evaluation
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    overallScore: v.number(),
    evaluatorId: v.id('users'),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate overall score
    if (args.overallScore < 0 || args.overallScore > 100) {
      throw new Error('Overall score must be between 0 and 100');
    }

    const evaluationId = await ctx.db.insert('complianceEvaluations', {
      projectId: args.projectId,
      standardId: args.standardId,
      overallScore: args.overallScore,
      evaluatorId: args.evaluatorId,
      notes: args.notes,
      evaluatedAt: now,
      createdAt: now,
    });

    return evaluationId;
  },
});

// Get evaluation statistics for a project
export const getProjectStatistics = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const evaluations = await ctx.db
      .query('complianceEvaluations')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    if (evaluations.length === 0) {
      return {
        averageScore: 0,
        totalEvaluations: 0,
        latestEvaluation: null,
        scoreTrend: 'no_data',
      };
    }

    const averageScore =
      evaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) /
      evaluations.length;
    const latestEvaluation = evaluations.sort((a, b) => b.evaluatedAt - a.evaluatedAt)[0];

    // Simple trend calculation (could be more sophisticated)
    let scoreTrend = 'stable';
    if (evaluations.length >= 2) {
      const sorted = evaluations.sort((a, b) => a.evaluatedAt - b.evaluatedAt);
      const firstScore = sorted[0].overallScore;
      const lastScore = sorted[sorted.length - 1].overallScore;

      if (lastScore > firstScore + 5) scoreTrend = 'improving';
      else if (lastScore < firstScore - 5) scoreTrend = 'declining';
    }

    return {
      averageScore: Math.round(averageScore * 10) / 10,
      totalEvaluations: evaluations.length,
      latestEvaluation,
      scoreTrend,
    };
  },
});
