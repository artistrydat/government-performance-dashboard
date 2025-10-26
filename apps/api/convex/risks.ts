import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Data validation rules
const riskValidation = {
  projectId: v.id('projects'),
  title: v.string(),
  description: v.string(),
  severity: v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high'),
    v.literal('critical')
  ),
  status: v.union(
    v.literal('identified'),
    v.literal('monitored'),
    v.literal('mitigated'),
    v.literal('resolved')
  ),
  probability: v.number(),
  impact: v.number(),
  mitigationPlan: v.optional(v.string()),
};

// Create a new risk
export const create = mutation({
  args: riskValidation,
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate probability (0-100)
    if (args.probability < 0 || args.probability > 100) {
      throw new Error('Probability must be between 0 and 100');
    }

    // Validate impact (0-100)
    if (args.impact < 0 || args.impact > 100) {
      throw new Error('Impact must be between 0 and 100');
    }

    // Verify project exists
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const riskId = await ctx.db.insert('risks', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return riskId;
  },
});

// Get a risk by ID
export const get = query({
  args: { riskId: v.id('risks') },
  handler: async (ctx, args) => {
    const risk = await ctx.db.get(args.riskId);
    if (!risk) {
      throw new Error('Risk not found');
    }
    return risk;
  },
});

// Get all risks
export const list = query({
  args: {},
  handler: async ctx => {
    const risks = await ctx.db.query('risks').collect();
    return risks;
  },
});

// Get risks by project
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const risks = await ctx.db
      .query('risks')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();
    return risks;
  },
});

// Get risks by severity
export const listBySeverity = query({
  args: {
    severity: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
  },
  handler: async (ctx, args) => {
    const risks = await ctx.db
      .query('risks')
      .withIndex('by_severity', q => q.eq('severity', args.severity))
      .collect();
    return risks;
  },
});

// Get risks by status
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal('identified'),
      v.literal('monitored'),
      v.literal('mitigated'),
      v.literal('resolved')
    ),
  },
  handler: async (ctx, args) => {
    const risks = await ctx.db
      .query('risks')
      .withIndex('by_status', q => q.eq('status', args.status))
      .collect();
    return risks;
  },
});

// Update a risk
export const update = mutation({
  args: {
    riskId: v.id('risks'),
    ...riskValidation,
  },
  handler: async (ctx, args) => {
    const { riskId, ...updateData } = args;

    // Validate probability if provided
    if (
      updateData.probability !== undefined &&
      (updateData.probability < 0 || updateData.probability > 100)
    ) {
      throw new Error('Probability must be between 0 and 100');
    }

    // Validate impact if provided
    if (updateData.impact !== undefined && (updateData.impact < 0 || updateData.impact > 100)) {
      throw new Error('Impact must be between 0 and 100');
    }

    // Verify project exists if projectId is being updated
    if (updateData.projectId) {
      const project = await ctx.db.get(updateData.projectId);
      if (!project) {
        throw new Error('Project not found');
      }
    }

    await ctx.db.patch(riskId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return riskId;
  },
});

// Delete a risk
export const remove = mutation({
  args: { riskId: v.id('risks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.riskId);
    return args.riskId;
  },
});

// Get risk statistics for a project
export const getProjectRiskStatistics = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const risks = await ctx.db
      .query('risks')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();

    const totalRisks = risks.length;
    const totalRiskScore = risks.reduce(
      (sum, risk) => sum + (risk.probability * risk.impact) / 100,
      0
    );
    const averageRiskScore = totalRisks > 0 ? totalRiskScore / totalRisks : 0;

    const severityCounts = {
      low: risks.filter(r => r.severity === 'low').length,
      medium: risks.filter(r => r.severity === 'medium').length,
      high: risks.filter(r => r.severity === 'high').length,
      critical: risks.filter(r => r.severity === 'critical').length,
    };

    const statusCounts = {
      identified: risks.filter(r => r.status === 'identified').length,
      monitored: risks.filter(r => r.status === 'monitored').length,
      mitigated: risks.filter(r => r.status === 'mitigated').length,
      resolved: risks.filter(r => r.status === 'resolved').length,
    };

    const highPriorityRisks = risks.filter(
      r => r.severity === 'high' || r.severity === 'critical'
    ).length;

    return {
      totalRisks,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      severityCounts,
      statusCounts,
      highPriorityRisks,
    };
  },
});

// Calculate risk score (probability * impact)
export const calculateRiskScore = (probability: number, impact: number): number => {
  return (probability * impact) / 100;
};

// Get high priority risks (high or critical severity)
export const getHighPriorityRisks = query({
  args: {},
  handler: async ctx => {
    const highRisks = await ctx.db
      .query('risks')
      .withIndex('by_severity', q => q.eq('severity', 'high'))
      .collect();

    const criticalRisks = await ctx.db
      .query('risks')
      .withIndex('by_severity', q => q.eq('severity', 'critical'))
      .collect();

    return [...highRisks, ...criticalRisks];
  },
});

// Update risk status
export const updateStatus = mutation({
  args: {
    riskId: v.id('risks'),
    status: v.union(
      v.literal('identified'),
      v.literal('monitored'),
      v.literal('mitigated'),
      v.literal('resolved')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.riskId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.riskId;
  },
});
