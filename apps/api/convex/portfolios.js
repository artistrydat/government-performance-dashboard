import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
// Data validation rules
const portfolioValidation = {
    name: v.string(),
    description: v.string(),
    ownerId: v.id('users'),
    healthScore: v.number(),
    totalBudget: v.number(),
    allocatedBudget: v.number(),
    resourceAllocation: v.object({
        teamMembers: v.number(),
        budgetUtilization: v.number(),
        projectCount: v.number(),
    }),
};
// Calculate portfolio health score based on its projects
const calculatePortfolioHealthScore = (projects) => {
    if (projects.length === 0) {
        return 100; // Default health score for empty portfolio
    }
    // Calculate weighted average based on project health scores and budgets
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    if (totalBudget === 0) {
        return projects.reduce((sum, project) => sum + project.healthScore, 0) / projects.length;
    }
    const weightedScore = projects.reduce((sum, project) => {
        const weight = project.budget / totalBudget;
        return sum + project.healthScore * weight;
    }, 0);
    return Math.round(weightedScore * 100) / 100; // Round to 2 decimal places
};
// Create a new portfolio
export const create = mutation({
    args: portfolioValidation,
    handler: async (ctx, args) => {
        const now = Date.now();
        // Validate health score (0-100)
        if (args.healthScore < 0 || args.healthScore > 100) {
            throw new Error('Health score must be between 0 and 100');
        }
        const portfolioId = await ctx.db.insert('portfolios', {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
        return portfolioId;
    },
});
// Get a portfolio by ID
export const get = query({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        const portfolio = await ctx.db.get(args.portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }
        return portfolio;
    },
});
// Get all portfolios
export const list = query({
    args: {},
    handler: async (ctx) => {
        const portfolios = await ctx.db.query('portfolios').collect();
        return portfolios;
    },
});
// Get portfolios by owner
export const listByOwner = query({
    args: { ownerId: v.id('users') },
    handler: async (ctx, args) => {
        const portfolios = await ctx.db
            .query('portfolios')
            .withIndex('by_owner', q => q.eq('ownerId', args.ownerId))
            .collect();
        return portfolios;
    },
});
// Update a portfolio
export const update = mutation({
    args: {
        portfolioId: v.id('portfolios'),
        ...portfolioValidation,
    },
    handler: async (ctx, args) => {
        const { portfolioId, ...updateData } = args;
        // Validate health score if provided
        if (updateData.healthScore !== undefined &&
            (updateData.healthScore < 0 || updateData.healthScore > 100)) {
            throw new Error('Health score must be between 0 and 100');
        }
        await ctx.db.patch(portfolioId, {
            ...updateData,
            updatedAt: Date.now(),
        });
        return portfolioId;
    },
});
// Delete a portfolio
export const remove = mutation({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        // Check if portfolio has any projects
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_portfolio', q => q.eq('portfolioId', args.portfolioId))
            .collect();
        if (projects.length > 0) {
            throw new Error('Cannot delete portfolio that contains projects. Please reassign or delete projects first.');
        }
        await ctx.db.delete(args.portfolioId);
        return args.portfolioId;
    },
});
// Calculate and update portfolio health score
export const updateHealthScore = mutation({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        // Get all projects in this portfolio
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_portfolio', q => q.eq('portfolioId', args.portfolioId))
            .collect();
        // Calculate new health score
        const newHealthScore = calculatePortfolioHealthScore(projects);
        // Update portfolio with new health score
        await ctx.db.patch(args.portfolioId, {
            healthScore: newHealthScore,
            updatedAt: Date.now(),
        });
        return {
            portfolioId: args.portfolioId,
            healthScore: newHealthScore,
            projectCount: projects.length,
        };
    },
});
// Get portfolio statistics
export const getStatistics = query({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        const portfolio = await ctx.db.get(args.portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }
        // Get all projects in this portfolio
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_portfolio', q => q.eq('portfolioId', args.portfolioId))
            .collect();
        const totalProjects = projects.length;
        const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
        const averageHealthScore = calculatePortfolioHealthScore(projects);
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
            portfolio: {
                name: portfolio.name,
                description: portfolio.description,
                healthScore: portfolio.healthScore,
            },
            statistics: {
                totalProjects,
                totalBudget,
                averageHealthScore,
                statusCounts,
                riskLevelCounts,
            },
        };
    },
});
// Get portfolio with projects
export const getWithProjects = query({
    args: { portfolioId: v.id('portfolios') },
    handler: async (ctx, args) => {
        const portfolio = await ctx.db.get(args.portfolioId);
        if (!portfolio) {
            throw new Error('Portfolio not found');
        }
        // Get all projects in this portfolio
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_portfolio', q => q.eq('portfolioId', args.portfolioId))
            .collect();
        return {
            portfolio,
            projects,
        };
    },
});
