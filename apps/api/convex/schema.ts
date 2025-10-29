import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  projects: defineTable({
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
    spentBudget: v.number(),
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
    teamMembers: v.array(v.id('users')),
    healthScore: v.number(),
    riskLevel: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_portfolio', ['portfolioId'])
    .index('by_owner', ['ownerId'])
    .index('by_health_score', ['healthScore'])
    .index('by_risk_level', ['riskLevel'])
    .index('by_created_at', ['createdAt']),

  portfolios: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_health_score', ['healthScore']),

  risks: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_severity', ['severity'])
    .index('by_status', ['status']),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal('executive'),
      v.literal('portfolio_manager'),
      v.literal('project_officer')
    ),
    department: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role']),
});
