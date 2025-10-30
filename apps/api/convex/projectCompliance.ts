import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get project compliance by ID
export const getById = query({
  args: { complianceId: v.id('projectCompliance') },
  handler: async (ctx, args) => {
    const compliance = await ctx.db.get(args.complianceId);
    if (!compliance) {
      throw new Error('Project compliance record not found');
    }
    return compliance;
  },
});

// Get compliance records by project
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const compliance = await ctx.db
      .query('projectCompliance')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .collect();
    return compliance;
  },
});

// Submit evidence for compliance
export const submitEvidence = mutation({
  args: {
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    criteriaId: v.id('pmiStandardCriteria'),
    evidence: v.string(),
    evidenceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if compliance record already exists
    const existing = await ctx.db
      .query('projectCompliance')
      .withIndex('by_project', q => q.eq('projectId', args.projectId))
      .filter(q =>
        q.and(
          q.eq(q.field('standardId'), args.standardId),
          q.eq(q.field('criteriaId'), args.criteriaId)
        )
      )
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        evidence: args.evidence,
        evidenceUrl: args.evidenceUrl,
        status: 'submitted',
        submittedAt: now,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new record
      const complianceId = await ctx.db.insert('projectCompliance', {
        projectId: args.projectId,
        standardId: args.standardId,
        criteriaId: args.criteriaId,
        status: 'submitted',
        score: 0,
        evidence: args.evidence,
        evidenceUrl: args.evidenceUrl,
        submittedAt: now,
        createdAt: now,
        updatedAt: now,
      });
      return complianceId;
    }
  },
});

// Update compliance status
export const updateStatus = mutation({
  args: {
    complianceId: v.id('projectCompliance'),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('submitted'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    score: v.optional(v.number()),
    reviewerId: v.optional(v.id('users')),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updateData: any = {
      status: args.status,
      updatedAt: now,
    };

    if (args.score !== undefined) {
      updateData.score = args.score;
    }

    if (args.reviewerId !== undefined) {
      updateData.reviewerId = args.reviewerId;
      updateData.reviewedAt = now;
    }

    await ctx.db.patch(args.complianceId, updateData);
    return args.complianceId;
  },
});
