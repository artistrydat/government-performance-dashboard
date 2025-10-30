import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
// Default preferences for each role
export const defaultPreferences = {
    executive: {
        theme: 'light',
        dashboardLayout: {
            widgets: [
                {
                    id: 'portfolio-health',
                    type: 'kpi',
                    position: { x: 0, y: 0 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'risk-overview',
                    type: 'chart',
                    position: { x: 2, y: 0 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'compliance-status',
                    type: 'kpi',
                    position: { x: 0, y: 1 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'portfolio-list',
                    type: 'table',
                    position: { x: 2, y: 1 },
                    size: { width: 2, height: 2 },
                    visible: true,
                },
            ],
            layoutType: 'grid',
        },
        defaultView: {
            executive: 'executive-dashboard',
            portfolio_manager: 'portfolio-management',
            project_officer: 'project-management',
        },
        notifications: {
            email: true,
            push: true,
            riskAlerts: true,
            projectUpdates: false,
        },
        accessibility: {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
        },
    },
    portfolio_manager: {
        theme: 'light',
        dashboardLayout: {
            widgets: [
                {
                    id: 'portfolio-health',
                    type: 'kpi',
                    position: { x: 0, y: 0 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'risk-heatmap',
                    type: 'chart',
                    position: { x: 2, y: 0 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'project-list',
                    type: 'table',
                    position: { x: 0, y: 1 },
                    size: { width: 2, height: 2 },
                    visible: true,
                },
                {
                    id: 'resource-allocation',
                    type: 'chart',
                    position: { x: 2, y: 1 },
                    size: { width: 2, height: 2 },
                    visible: true,
                },
            ],
            layoutType: 'grid',
        },
        defaultView: {
            executive: 'executive-dashboard',
            portfolio_manager: 'portfolio-management',
            project_officer: 'project-management',
        },
        notifications: {
            email: true,
            push: true,
            riskAlerts: true,
            projectUpdates: true,
        },
        accessibility: {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
        },
    },
    project_officer: {
        theme: 'light',
        dashboardLayout: {
            widgets: [
                {
                    id: 'project-health',
                    type: 'kpi',
                    position: { x: 0, y: 0 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'risk-list',
                    type: 'table',
                    position: { x: 2, y: 0 },
                    size: { width: 2, height: 2 },
                    visible: true,
                },
                {
                    id: 'timeline',
                    type: 'chart',
                    position: { x: 0, y: 1 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
                {
                    id: 'budget-tracker',
                    type: 'kpi',
                    position: { x: 0, y: 2 },
                    size: { width: 2, height: 1 },
                    visible: true,
                },
            ],
            layoutType: 'grid',
        },
        defaultView: {
            executive: 'executive-dashboard',
            portfolio_manager: 'portfolio-management',
            project_officer: 'project-management',
        },
        notifications: {
            email: true,
            push: true,
            riskAlerts: true,
            projectUpdates: true,
        },
        accessibility: {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
        },
    },
};
// Get user preferences
export const getUserPreferences = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        // Try to get user by ID first from users table
        let user = await ctx.db
            .query('users')
            .filter(q => q.eq(q.field('_id'), args.userId))
            .first();
        // If not found by ID, try by email
        if (!user) {
            user = await ctx.db
                .query('users')
                .withIndex('by_email', q => q.eq('email', args.userId))
                .first();
        }
        if (!user) {
            // Return default executive preferences if user not found
            // This prevents the app from crashing for unauthenticated users
            return defaultPreferences.executive;
        }
        // Return default preferences based on role
        return defaultPreferences[user.role] || defaultPreferences.executive;
    },
});
// Update user preferences
export const updateUserPreferences = mutation({
    args: {
        userId: v.string(),
        preferences: v.object({
            theme: v.union(v.literal('light'), v.literal('dark'), v.literal('auto')),
            dashboardLayout: v.object({
                widgets: v.array(v.object({
                    id: v.string(),
                    type: v.string(),
                    position: v.object({ x: v.number(), y: v.number() }),
                    size: v.object({ width: v.number(), height: v.number() }),
                    visible: v.boolean(),
                })),
                layoutType: v.union(v.literal('grid'), v.literal('freeform')),
            }),
            defaultView: v.object({
                executive: v.string(),
                portfolio_manager: v.string(),
                project_officer: v.string(),
            }),
            notifications: v.object({
                email: v.boolean(),
                push: v.boolean(),
                riskAlerts: v.boolean(),
                projectUpdates: v.boolean(),
            }),
            accessibility: v.object({
                fontSize: v.union(v.literal('small'), v.literal('medium'), v.literal('large')),
                highContrast: v.boolean(),
                reducedMotion: v.boolean(),
            }),
        }),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_email', q => q.eq('email', args.userId))
            .first();
        if (!user) {
            throw new Error('User not found');
        }
        // In a real implementation, we'd store preferences in the database
        // For now, we'll just return the updated preferences
        return args.preferences;
    },
});
// Reset user preferences to default
export const resetUserPreferences = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_email', q => q.eq('email', args.userId))
            .first();
        if (!user) {
            throw new Error('User not found');
        }
        return defaultPreferences[user.role] || defaultPreferences.executive;
    },
});
