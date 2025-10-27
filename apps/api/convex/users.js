import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
// Data validation rules
const userValidation = {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('executive'), v.literal('portfolio_manager'), v.literal('project_officer')),
    department: v.string(),
};
// Create a new user
export const create = mutation({
    args: userValidation,
    handler: async (ctx, args) => {
        const now = Date.now();
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(args.email)) {
            throw new Error('Invalid email format');
        }
        // Check if user with same email already exists
        const existingUser = await ctx.db
            .query('users')
            .withIndex('by_email', q => q.eq('email', args.email))
            .first();
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const userId = await ctx.db.insert('users', {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
        return userId;
    },
});
// Get a user by ID
export const get = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
});
// Get all users
export const list = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query('users').collect();
        return users;
    },
});
// Get user by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_email', q => q.eq('email', args.email))
            .first();
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
});
// Get users by role
export const listByRole = query({
    args: {
        role: v.union(v.literal('executive'), v.literal('portfolio_manager'), v.literal('project_officer')),
    },
    handler: async (ctx, args) => {
        const users = await ctx.db
            .query('users')
            .withIndex('by_role', q => q.eq('role', args.role))
            .collect();
        return users;
    },
});
// Update a user
export const update = mutation({
    args: {
        userId: v.id('users'),
        ...userValidation,
    },
    handler: async (ctx, args) => {
        const { userId, ...updateData } = args;
        // Validate email format if provided
        if (updateData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.email)) {
                throw new Error('Invalid email format');
            }
            // Check if email is already taken by another user
            const existingUser = await ctx.db
                .query('users')
                .withIndex('by_email', q => q.eq('email', updateData.email))
                .first();
            if (existingUser && existingUser._id !== userId) {
                throw new Error('Email is already taken by another user');
            }
        }
        await ctx.db.patch(userId, {
            ...updateData,
            updatedAt: Date.now(),
        });
        return userId;
    },
});
// Delete a user
export const remove = mutation({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        // Check if user is referenced in other collections
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_owner', q => q.eq('ownerId', args.userId))
            .collect();
        const portfolios = await ctx.db
            .query('portfolios')
            .withIndex('by_owner', q => q.eq('ownerId', args.userId))
            .collect();
        if (projects.length > 0 || portfolios.length > 0) {
            throw new Error('Cannot delete user: user is referenced in projects or portfolios');
        }
        await ctx.db.delete(args.userId);
        return args.userId;
    },
});
// Get user statistics
export const getStatistics = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query('users').collect();
        const totalUsers = users.length;
        const roleCounts = {
            executive: users.filter(u => u.role === 'executive').length,
            portfolio_manager: users.filter(u => u.role === 'portfolio_manager').length,
            project_officer: users.filter(u => u.role === 'project_officer').length,
        };
        const departmentCounts = users.reduce((acc, user) => {
            acc[user.department] = (acc[user.department] || 0) + 1;
            return acc;
        }, {});
        return {
            totalUsers,
            roleCounts,
            departmentCounts,
        };
    },
});
// Get user with their projects and portfolios
export const getWithDetails = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Get user's projects
        const projects = await ctx.db
            .query('projects')
            .withIndex('by_owner', q => q.eq('ownerId', args.userId))
            .collect();
        // Get user's portfolios
        const portfolios = await ctx.db
            .query('portfolios')
            .withIndex('by_owner', q => q.eq('ownerId', args.userId))
            .collect();
        return {
            user,
            projects,
            portfolios,
        };
    },
});
// Role-based permission checking functions
export const hasPermission = query({
    args: {
        userId: v.id('users'),
        requiredRole: v.union(v.literal('executive'), v.literal('portfolio_manager'), v.literal('project_officer')),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            return false;
        }
        // Role hierarchy: executive > portfolio_manager > project_officer
        const roleHierarchy = {
            executive: 3,
            portfolio_manager: 2,
            project_officer: 1,
        };
        return roleHierarchy[user.role] >= roleHierarchy[args.requiredRole];
    },
});
// Check if user can access project
export const canAccessProject = query({
    args: {
        userId: v.id('users'),
        projectId: v.id('projects'),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        const project = await ctx.db.get(args.projectId);
        if (!user || !project) {
            return false;
        }
        // Executives can access all projects
        if (user.role === 'executive') {
            return true;
        }
        // Portfolio managers can access projects in their portfolios
        if (user.role === 'portfolio_manager') {
            if (!project.portfolioId)
                return false;
            const portfolio = await ctx.db.get(project.portfolioId);
            return portfolio?.ownerId === args.userId;
        }
        // Project officers can only access their own projects
        return project.ownerId === args.userId;
    },
});
// Check if user can access portfolio
export const canAccessPortfolio = query({
    args: {
        userId: v.id('users'),
        portfolioId: v.id('portfolios'),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        const portfolio = await ctx.db.get(args.portfolioId);
        if (!user || !portfolio) {
            return false;
        }
        // Executives can access all portfolios
        if (user.role === 'executive') {
            return true;
        }
        // Portfolio managers and project officers can only access their own portfolios
        return portfolio.ownerId === args.userId;
    },
});
