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

  // PMI Standards Database for Epic 3
  pmiStandards: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.union(v.literal('portfolio'), v.literal('program'), v.literal('project')),
    level: v.union(v.literal('foundational'), v.literal('intermediate'), v.literal('advanced')),
    weight: v.number(), // Scoring weight (0-1)
    version: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_level', ['level'])
    .index('by_active', ['isActive'])
    .index('by_version', ['version']),

  pmiStandardCriteria: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_standard', ['standardId'])
    .index('by_order', ['order'])
    .index('by_mandatory', ['isMandatory']),

  projectCompliance: defineTable({
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    criteriaId: v.id('pmiStandardCriteria'),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('submitted'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    score: v.number(),
    evidence: v.optional(v.string()),
    evidenceUrl: v.optional(v.string()),
    reviewerId: v.optional(v.id('users')),
    reviewedAt: v.optional(v.number()),
    submittedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_standard', ['standardId'])
    .index('by_criteria', ['criteriaId'])
    .index('by_status', ['status'])
    .index('by_reviewer', ['reviewerId']),

  complianceEvaluations: defineTable({
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    overallScore: v.number(),
    evaluatedAt: v.number(),
    evaluatorId: v.id('users'),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_standard', ['standardId'])
    .index('by_evaluated_at', ['evaluatedAt']),

  // Automated compliance checking tables for Story 3.2.1
  complianceSchedules: defineTable({
    frequency: v.union(v.literal('daily'), v.literal('weekly'), v.literal('monthly')),
    portfolioIds: v.array(v.id('portfolios')),
    standardIds: v.array(v.id('pmiStandards')),
    nextEvaluationTime: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_next_evaluation', ['nextEvaluationTime'])
    .index('by_active', ['isActive']),

  complianceNotifications: defineTable({
    recipientId: v.id('users'),
    projectId: v.id('projects'),
    standardId: v.id('pmiStandards'),
    alertType: v.union(
      v.literal('non_compliant'),
      v.literal('declining_trend'),
      v.literal('missing_evidence'),
      v.literal('overdue_evaluation')
    ),
    severity: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_recipient', ['recipientId'])
    .index('by_project', ['projectId'])
    .index('by_created_at', ['createdAt'])
    .index('by_read_status', ['isRead']),
});
