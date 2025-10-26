import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Data validation rules
const projectValidation = {
  name: v.string(),
  description: v.string(),
  status: v.union(
    v.literal('planned'),
    v.literal('active'),
    v.literal('at-risk'),
    v.literal('delayed'),
    v.literal('completed')
  ),
  budget: v.number(),
  timeline: v.object({
    startDate: v.number(),
    endDate: v.number(),
    milestones: v.array(
      v.object({
        name: v.string(),
        date: v.number(),
        status: v.string(),
      })
    ),
  }),
  portfolioId: v.optional(v.id('portfolios')),
  ownerId: v.optional(v.id('users')),
  healthScore: v.number(),
  riskLevel: v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high'),
    v.literal('critical')
  ),
  tags: v.array(v.string()),
};

// Create a new project
export const create = mutation({
  args: projectValidation,
  handler: async (ctx, args) => {
    const now = Date.now();

    // Validate budget (positive number)
    if (args.budget <= 0) {
      throw new Error('Budget must be a positive number');
    }

    // Validate health score (0-100)
    if (args.healthScore < 0 || args.healthScore > 100) {
      throw new Error('Health score must be between 0 and 100');
    }

    // Validate timeline dates
    if (args.timeline.startDate >= args.timeline.endDate) {
      throw new Error('Start date must be before end date');
    }

    const projectId = await ctx.db.insert('projects', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

// Get a project by ID
export const get = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  },
});

// Get all projects
export const list = query({
  args: {},
  handler: async ctx => {
    const projects = await ctx.db.query('projects').collect();
    return projects;
  },
});

// Get projects by status
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal('planned'),
      v.literal('active'),
      v.literal('at-risk'),
      v.literal('delayed'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_status', q => q.eq('status', args.status))
      .collect();
    return projects;
  },
});

// Get projects by portfolio
export const listByPortfolio = query({
  args: { portfolioId: v.id('portfolios') },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_portfolio', q => q.eq('portfolioId', args.portfolioId))
      .collect();
    return projects;
  },
});

// Update a project
export const update = mutation({
  args: {
    projectId: v.id('projects'),
    ...projectValidation,
  },
  handler: async (ctx, args) => {
    const { projectId, ...updateData } = args;

    // Validate budget if provided
    if (updateData.budget !== undefined && updateData.budget <= 0) {
      throw new Error('Budget must be a positive number');
    }

    // Validate health score if provided
    if (
      updateData.healthScore !== undefined &&
      (updateData.healthScore < 0 || updateData.healthScore > 100)
    ) {
      throw new Error('Health score must be between 0 and 100');
    }

    // Validate timeline dates if provided
    if (updateData.timeline && updateData.timeline.startDate >= updateData.timeline.endDate) {
      throw new Error('Start date must be before end date');
    }

    await ctx.db.patch(projectId, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

// Delete a project
export const remove = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
    return args.projectId;
  },
});

// Get project statistics
export const getStatistics = query({
  args: {},
  handler: async ctx => {
    const projects = await ctx.db.query('projects').collect();

    const totalProjects = projects.length;
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const averageHealthScore =
      projects.length > 0
        ? projects.reduce((sum, project) => sum + project.healthScore, 0) / projects.length
        : 0;

    const statusCounts = {
      planned: projects.filter(p => p.status === 'planned').length,
      active: projects.filter(p => p.status === 'active').length,
      'at-risk': projects.filter(p => p.status === 'at-risk').length,
      delayed: projects.filter(p => p.status === 'delayed').length,
      completed: projects.filter(p => p.status === 'completed').length,
    };

    const riskLevelCounts = {
      low: projects.filter(p => p.riskLevel === 'low').length,
      medium: projects.filter(p => p.riskLevel === 'medium').length,
      high: projects.filter(p => p.riskLevel === 'high').length,
      critical: projects.filter(p => p.riskLevel === 'critical').length,
    };

    return {
      totalProjects,
      totalBudget,
      averageHealthScore,
      statusCounts,
      riskLevelCounts,
    };
  },
});
