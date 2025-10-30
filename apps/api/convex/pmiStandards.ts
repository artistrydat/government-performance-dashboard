import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all active PMI standards
export const listActive = query({
  args: {},
  handler: async ctx => {
    const standards = await ctx.db
      .query('pmiStandards')
      .withIndex('by_active', q => q.eq('isActive', true))
      .collect();
    return standards;
  },
});

// Get PMI standards by category
export const listByCategory = query({
  args: { category: v.union(v.literal('portfolio'), v.literal('program'), v.literal('project')) },
  handler: async (ctx, args) => {
    const standards = await ctx.db
      .query('pmiStandards')
      .withIndex('by_category', q => q.eq('category', args.category))
      .collect();
    return standards;
  },
});

// Get PMI standard by ID
export const getById = query({
  args: { standardId: v.id('pmiStandards') },
  handler: async (ctx, args) => {
    const standard = await ctx.db.get(args.standardId);
    if (!standard) {
      throw new Error('PMI standard not found');
    }
    return standard;
  },
});

// Create a new PMI standard
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.union(v.literal('portfolio'), v.literal('program'), v.literal('project')),
    level: v.union(v.literal('foundational'), v.literal('intermediate'), v.literal('advanced')),
    weight: v.number(),
    version: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate weight
    if (args.weight <= 0 || args.weight > 1) {
      throw new Error('Weight must be between 0 and 1');
    }

    const standardId = await ctx.db.insert('pmiStandards', {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return standardId;
  },
});

// Update a PMI standard
export const update = mutation({
  args: {
    standardId: v.id('pmiStandards'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(
      v.union(v.literal('portfolio'), v.literal('program'), v.literal('project'))
    ),
    level: v.optional(
      v.union(v.literal('foundational'), v.literal('intermediate'), v.literal('advanced'))
    ),
    weight: v.optional(v.number()),
    version: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { standardId, ...updateData } = args;

    // Validate weight if provided
    if (updateData.weight !== undefined && (updateData.weight <= 0 || updateData.weight > 1)) {
      throw new Error('Weight must be between 0 and 1');
    }

    await ctx.db.patch(standardId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return standardId;
  },
});

// Get standards with their criteria
export const listWithCriteria = query({
  args: {},
  handler: async ctx => {
    const standards = await ctx.db
      .query('pmiStandards')
      .withIndex('by_active', q => q.eq('isActive', true))
      .collect();

    const standardsWithCriteria = await Promise.all(
      standards.map(async standard => {
        const criteria = await ctx.db
          .query('pmiStandardCriteria')
          .withIndex('by_standard', q => q.eq('standardId', standard._id))
          .collect();

        return {
          ...standard,
          criteria,
        };
      })
    );

    return standardsWithCriteria;
  },
});
