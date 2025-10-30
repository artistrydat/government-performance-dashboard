import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all PMI standard criteria
export const listAll = query({
  args: {},
  handler: async ctx => {
    const criteria = await ctx.db.query('pmiStandardCriteria').collect();
    return criteria;
  },
});

// Get criteria by standard ID
export const listByStandard = query({
  args: { standardId: v.id('pmiStandards') },
  handler: async (ctx, args) => {
    const criteria = await ctx.db
      .query('pmiStandardCriteria')
      .withIndex('by_standard', q => q.eq('standardId', args.standardId))
      .collect();
    return criteria;
  },
});

// Get PMI standard criteria by ID
export const getById = query({
  args: { criteriaId: v.id('pmiStandardCriteria') },
  handler: async (ctx, args) => {
    const criteria = await ctx.db.get(args.criteriaId);
    if (!criteria) {
      throw new Error('PMI standard criteria not found');
    }
    return criteria;
  },
});

// Create new PMI standard criteria
export const create = mutation({
  args: {
    standardId: v.id('pmiStandards'),
    name: v.string(),
    description: v.string(),
    requirement: v.string(),
    evidenceType: v.union(
      v.literal('document'),
      v.literal('link'),
      v.literal('text'),
      v.literal('file')
    ),
    evidenceDescription: v.string(),
    scoringMethod: v.union(v.literal('binary'), v.literal('partial'), v.literal('scale')),
    maxScore: v.number(),
    isMandatory: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate max score
    if (args.maxScore <= 0) {
      throw new Error('Max score must be positive');
    }

    // Validate order
    if (args.order <= 0) {
      throw new Error('Order must be positive');
    }

    const criteriaId = await ctx.db.insert('pmiStandardCriteria', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return criteriaId;
  },
});

// Update PMI standard criteria
export const update = mutation({
  args: {
    criteriaId: v.id('pmiStandardCriteria'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    requirement: v.optional(v.string()),
    evidenceType: v.optional(
      v.union(v.literal('document'), v.literal('link'), v.literal('text'), v.literal('file'))
    ),
    evidenceDescription: v.optional(v.string()),
    scoringMethod: v.optional(
      v.union(v.literal('binary'), v.literal('partial'), v.literal('scale'))
    ),
    maxScore: v.optional(v.number()),
    isMandatory: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { criteriaId, ...updateData } = args;

    // Validate max score if provided
    if (updateData.maxScore !== undefined && updateData.maxScore <= 0) {
      throw new Error('Max score must be positive');
    }

    // Validate order if provided
    if (updateData.order !== undefined && updateData.order <= 0) {
      throw new Error('Order must be positive');
    }

    await ctx.db.patch(criteriaId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return criteriaId;
  },
});
