import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { QueryCtx } from './_generated/server';

/**
 * Data validation functions for the government dashboard system
 * These functions provide reusable validation logic that can be used across multiple mutations
 */

// Project validation rules
export const projectValidation = {
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

// Portfolio validation rules
export const portfolioValidation = {
  name: v.string(),
  description: v.string(),
  ownerId: v.id('users'),
  healthScore: v.number(),
};

// Risk validation rules
export const riskValidation = {
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

// User validation rules
export const userValidation = {
  name: v.string(),
  email: v.string(),
  role: v.union(
    v.literal('executive'),
    v.literal('portfolio_manager'),
    v.literal('project_officer')
  ),
  department: v.string(),
};

/**
 * Custom validation functions
 */

/**
 * Validates budget amount
 * @param budget - The budget amount to validate
 * @throws Error if budget is not a positive number
 */
export function validateBudget(budget: number): void {
  if (budget <= 0) {
    throw new Error('Budget must be a positive number');
  }
}

/**
 * Validates health score (0-100 range)
 * @param healthScore - The health score to validate
 * @throws Error if health score is not between 0 and 100
 */
export function validateHealthScore(healthScore: number): void {
  if (healthScore < 0 || healthScore > 100) {
    throw new Error('Health score must be between 0 and 100');
  }
}

/**
 * Validates timeline dates
 * @param startDate - The start date timestamp
 * @param endDate - The end date timestamp
 * @throws Error if start date is not before end date
 */
export function validateTimelineDates(startDate: number, endDate: number): void {
  if (startDate >= endDate) {
    throw new Error('Start date must be before end date');
  }
}

/**
 * Validates probability value (0-100 range)
 * @param probability - The probability value to validate
 * @throws Error if probability is not between 0 and 100
 */
export function validateProbability(probability: number): void {
  if (probability < 0 || probability > 100) {
    throw new Error('Probability must be between 0 and 100');
  }
}

/**
 * Validates impact value (0-100 range)
 * @param impact - The impact value to validate
 * @throws Error if impact is not between 0 and 100
 */
export function validateImpact(impact: number): void {
  if (impact < 0 || impact > 100) {
    throw new Error('Impact must be between 0 and 100');
  }
}

/**
 * Validates email format
 * @param email - The email address to validate
 * @throws Error if email format is invalid
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

/**
 * Validates project status transition
 * @param currentStatus - The current project status
 * @param newStatus - The new project status
 * @throws Error if status transition is invalid
 */
export function validateProjectStatusTransition(currentStatus: string, newStatus: string): void {
  const validTransitions: Record<string, string[]> = {
    planned: ['active', 'cancelled'],
    active: ['at-risk', 'delayed', 'completed'],
    'at-risk': ['active', 'delayed', 'completed'],
    delayed: ['active', 'at-risk', 'completed'],
    completed: [], // Cannot transition from completed
  };

  if (currentStatus === newStatus) {
    return; // Same status is always valid
  }

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }
}

/**
 * Validates risk severity and probability/impact consistency
 * @param severity - The risk severity
 * @param probability - The risk probability
 * @param impact - The risk impact
 * @throws Error if severity doesn't match probability/impact values
 */
export function validateRiskSeverityConsistency(
  severity: string,
  probability: number,
  impact: number
): void {
  const riskScore = (probability * impact) / 100;

  const severityThresholds = {
    low: 0,
    medium: 25,
    high: 50,
    critical: 75,
  };

  const expectedSeverity = Object.entries(severityThresholds)
    .reverse()
    .find(([, threshold]) => riskScore >= threshold)?.[0];

  if (expectedSeverity !== severity) {
    throw new Error(
      `Risk severity (${severity}) doesn't match calculated risk score (${riskScore.toFixed(1)}). ` +
        `Expected severity: ${expectedSeverity}`
    );
  }
}

/**
 * Validates that a portfolio can be deleted (no projects assigned)
 * @param ctx - Convex context
 * @param portfolioId - The portfolio ID to validate
 * @throws Error if portfolio contains projects
 */
export async function validatePortfolioDeletion(
  ctx: QueryCtx,
  portfolioId: Id<'portfolios'>
): Promise<void> {
  const projects = await ctx.db
    .query('projects')
    .withIndex('by_portfolio', (q: any) => q.eq('portfolioId', portfolioId))
    .collect();

  if (projects.length > 0) {
    throw new Error(
      'Cannot delete portfolio that contains projects. Please reassign or delete projects first.'
    );
  }
}

/**
 * Validates that a user can be deleted (not referenced in projects or portfolios)
 * @param ctx - Convex context
 * @param userId - The user ID to validate
 * @throws Error if user is referenced in projects or portfolios
 */
export async function validateUserDeletion(ctx: QueryCtx, userId: Id<'users'>): Promise<void> {
  const projects = await ctx.db
    .query('projects')
    .withIndex('by_owner', (q: any) => q.eq('ownerId', userId))
    .collect();

  const portfolios = await ctx.db
    .query('portfolios')
    .withIndex('by_owner', (q: any) => q.eq('ownerId', userId))
    .collect();

  if (projects.length > 0 || portfolios.length > 0) {
    throw new Error('Cannot delete user: user is referenced in projects or portfolios');
  }
}

/**
 * Validates email uniqueness
 * @param ctx - Convex context
 * @param email - The email to check
 * @param excludeUserId - Optional user ID to exclude from uniqueness check (for updates)
 * @throws Error if email is already taken
 */
export async function validateEmailUniqueness(
  ctx: QueryCtx,
  email: string,
  excludeUserId?: Id<'users'>
): Promise<void> {
  const existingUser = await ctx.db
    .query('users')
    .withIndex('by_email', (q: any) => q.eq('email', email))
    .first();

  if (existingUser && existingUser._id !== excludeUserId) {
    throw new Error('Email is already taken by another user');
  }
}

/**
 * Validates project exists
 * @param ctx - Convex context
 * @param projectId - The project ID to validate
 * @throws Error if project doesn't exist
 */
export async function validateProjectExists(
  ctx: QueryCtx,
  projectId: Id<'projects'>
): Promise<void> {
  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
}

/**
 * Validates portfolio exists
 * @param ctx - Convex context
 * @param portfolioId - The portfolio ID to validate
 * @throws Error if portfolio doesn't exist
 */
export async function validatePortfolioExists(
  ctx: QueryCtx,
  portfolioId: Id<'portfolios'>
): Promise<void> {
  const portfolio = await ctx.db.get(portfolioId);
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
}

/**
 * Validates user exists
 * @param ctx - Convex context
 * @param userId - The user ID to validate
 * @throws Error if user doesn't exist
 */
export async function validateUserExists(ctx: QueryCtx, userId: Id<'users'>): Promise<void> {
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error('User not found');
  }
}

/**
 * Validates risk exists
 * @param ctx - Convex context
 * @param riskId - The risk ID to validate
 * @throws Error if risk doesn't exist
 */
export async function validateRiskExists(ctx: QueryCtx, riskId: Id<'risks'>): Promise<void> {
  const risk = await ctx.db.get(riskId);
  if (!risk) {
    throw new Error('Risk not found');
  }
}

/**
 * Comprehensive project data validation
 * @param projectData - The project data to validate
 * @throws Error if any validation fails
 */
export function validateProjectData(projectData: any): void {
  validateBudget(projectData.budget);
  validateHealthScore(projectData.healthScore);
  validateTimelineDates(projectData.timeline.startDate, projectData.timeline.endDate);

  // Validate milestones
  projectData.timeline.milestones.forEach((milestone: any, index: number) => {
    if (!milestone.name || milestone.name.trim() === '') {
      throw new Error(`Milestone ${index + 1} must have a name`);
    }
    if (
      milestone.date < projectData.timeline.startDate ||
      milestone.date > projectData.timeline.endDate
    ) {
      throw new Error(`Milestone ${index + 1} date must be within project timeline`);
    }
  });
}

/**
 * Comprehensive risk data validation
 * @param riskData - The risk data to validate
 * @throws Error if any validation fails
 */
export function validateRiskData(riskData: any): void {
  validateProbability(riskData.probability);
  validateImpact(riskData.impact);
  validateRiskSeverityConsistency(riskData.severity, riskData.probability, riskData.impact);
}

/**
 * Comprehensive user data validation
 * @param userData - The user data to validate
 * @throws Error if any validation fails
 */
export function validateUserData(userData: any): void {
  validateEmail(userData.email);

  if (!userData.name || userData.name.trim() === '') {
    throw new Error('User name is required');
  }

  if (!userData.department || userData.department.trim() === '') {
    throw new Error('Department is required');
  }
}
