import { Id } from './_generated/dataModel';
import { QueryCtx } from './_generated/server';
/**
 * Data validation functions for the government dashboard system
 * These functions provide reusable validation logic that can be used across multiple mutations
 */
export declare const projectValidation: {
    name: import("convex/values").VString<string, "required">;
    description: import("convex/values").VString<string, "required">;
    status: import("convex/values").VUnion<"planned" | "active" | "at-risk" | "delayed" | "completed", [import("convex/values").VLiteral<"planned", "required">, import("convex/values").VLiteral<"active", "required">, import("convex/values").VLiteral<"at-risk", "required">, import("convex/values").VLiteral<"delayed", "required">, import("convex/values").VLiteral<"completed", "required">], "required", never>;
    budget: import("convex/values").VFloat64<number, "required">;
    timeline: import("convex/values").VObject<{
        startDate: number;
        endDate: number;
        milestones: {
            name: string;
            status: string;
            date: number;
        }[];
    }, {
        startDate: import("convex/values").VFloat64<number, "required">;
        endDate: import("convex/values").VFloat64<number, "required">;
        milestones: import("convex/values").VArray<{
            name: string;
            status: string;
            date: number;
        }[], import("convex/values").VObject<{
            name: string;
            status: string;
            date: number;
        }, {
            name: import("convex/values").VString<string, "required">;
            date: import("convex/values").VFloat64<number, "required">;
            status: import("convex/values").VString<string, "required">;
        }, "required", "name" | "status" | "date">, "required">;
    }, "required", "startDate" | "endDate" | "milestones">;
    portfolioId: import("convex/values").VId<import("convex/values").GenericId<"portfolios"> | undefined, "optional">;
    ownerId: import("convex/values").VId<import("convex/values").GenericId<"users"> | undefined, "optional">;
    healthScore: import("convex/values").VFloat64<number, "required">;
    riskLevel: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
    tags: import("convex/values").VArray<string[], import("convex/values").VString<string, "required">, "required">;
};
export declare const portfolioValidation: {
    name: import("convex/values").VString<string, "required">;
    description: import("convex/values").VString<string, "required">;
    ownerId: import("convex/values").VId<import("convex/values").GenericId<"users">, "required">;
    healthScore: import("convex/values").VFloat64<number, "required">;
};
export declare const riskValidation: {
    projectId: import("convex/values").VId<import("convex/values").GenericId<"projects">, "required">;
    title: import("convex/values").VString<string, "required">;
    description: import("convex/values").VString<string, "required">;
    severity: import("convex/values").VUnion<"low" | "medium" | "high" | "critical", [import("convex/values").VLiteral<"low", "required">, import("convex/values").VLiteral<"medium", "required">, import("convex/values").VLiteral<"high", "required">, import("convex/values").VLiteral<"critical", "required">], "required", never>;
    status: import("convex/values").VUnion<"identified" | "monitored" | "mitigated" | "resolved", [import("convex/values").VLiteral<"identified", "required">, import("convex/values").VLiteral<"monitored", "required">, import("convex/values").VLiteral<"mitigated", "required">, import("convex/values").VLiteral<"resolved", "required">], "required", never>;
    probability: import("convex/values").VFloat64<number, "required">;
    impact: import("convex/values").VFloat64<number, "required">;
    mitigationPlan: import("convex/values").VString<string | undefined, "optional">;
};
export declare const userValidation: {
    name: import("convex/values").VString<string, "required">;
    email: import("convex/values").VString<string, "required">;
    role: import("convex/values").VUnion<"executive" | "portfolio_manager" | "project_officer", [import("convex/values").VLiteral<"executive", "required">, import("convex/values").VLiteral<"portfolio_manager", "required">, import("convex/values").VLiteral<"project_officer", "required">], "required", never>;
    department: import("convex/values").VString<string, "required">;
};
/**
 * Custom validation functions
 */
/**
 * Validates budget amount
 * @param budget - The budget amount to validate
 * @throws Error if budget is not a positive number
 */
export declare function validateBudget(budget: number): void;
/**
 * Validates health score (0-100 range)
 * @param healthScore - The health score to validate
 * @throws Error if health score is not between 0 and 100
 */
export declare function validateHealthScore(healthScore: number): void;
/**
 * Validates timeline dates
 * @param startDate - The start date timestamp
 * @param endDate - The end date timestamp
 * @throws Error if start date is not before end date
 */
export declare function validateTimelineDates(startDate: number, endDate: number): void;
/**
 * Validates probability value (0-100 range)
 * @param probability - The probability value to validate
 * @throws Error if probability is not between 0 and 100
 */
export declare function validateProbability(probability: number): void;
/**
 * Validates impact value (0-100 range)
 * @param impact - The impact value to validate
 * @throws Error if impact is not between 0 and 100
 */
export declare function validateImpact(impact: number): void;
/**
 * Validates email format
 * @param email - The email address to validate
 * @throws Error if email format is invalid
 */
export declare function validateEmail(email: string): void;
/**
 * Validates project status transition
 * @param currentStatus - The current project status
 * @param newStatus - The new project status
 * @throws Error if status transition is invalid
 */
export declare function validateProjectStatusTransition(currentStatus: string, newStatus: string): void;
/**
 * Validates risk severity and probability/impact consistency
 * @param severity - The risk severity
 * @param probability - The risk probability
 * @param impact - The risk impact
 * @throws Error if severity doesn't match probability/impact values
 */
export declare function validateRiskSeverityConsistency(severity: string, probability: number, impact: number): void;
/**
 * Validates that a portfolio can be deleted (no projects assigned)
 * @param ctx - Convex context
 * @param portfolioId - The portfolio ID to validate
 * @throws Error if portfolio contains projects
 */
export declare function validatePortfolioDeletion(ctx: QueryCtx, portfolioId: Id<'portfolios'>): Promise<void>;
/**
 * Validates that a user can be deleted (not referenced in projects or portfolios)
 * @param ctx - Convex context
 * @param userId - The user ID to validate
 * @throws Error if user is referenced in projects or portfolios
 */
export declare function validateUserDeletion(ctx: QueryCtx, userId: Id<'users'>): Promise<void>;
/**
 * Validates email uniqueness
 * @param ctx - Convex context
 * @param email - The email to check
 * @param excludeUserId - Optional user ID to exclude from uniqueness check (for updates)
 * @throws Error if email is already taken
 */
export declare function validateEmailUniqueness(ctx: QueryCtx, email: string, excludeUserId?: Id<'users'>): Promise<void>;
/**
 * Validates project exists
 * @param ctx - Convex context
 * @param projectId - The project ID to validate
 * @throws Error if project doesn't exist
 */
export declare function validateProjectExists(ctx: QueryCtx, projectId: Id<'projects'>): Promise<void>;
/**
 * Validates portfolio exists
 * @param ctx - Convex context
 * @param portfolioId - The portfolio ID to validate
 * @throws Error if portfolio doesn't exist
 */
export declare function validatePortfolioExists(ctx: QueryCtx, portfolioId: Id<'portfolios'>): Promise<void>;
/**
 * Validates user exists
 * @param ctx - Convex context
 * @param userId - The user ID to validate
 * @throws Error if user doesn't exist
 */
export declare function validateUserExists(ctx: QueryCtx, userId: Id<'users'>): Promise<void>;
/**
 * Validates risk exists
 * @param ctx - Convex context
 * @param riskId - The risk ID to validate
 * @throws Error if risk doesn't exist
 */
export declare function validateRiskExists(ctx: QueryCtx, riskId: Id<'risks'>): Promise<void>;
/**
 * Comprehensive project data validation
 * @param projectData - The project data to validate
 * @throws Error if any validation fails
 */
export declare function validateProjectData(projectData: any): void;
/**
 * Comprehensive risk data validation
 * @param riskData - The risk data to validate
 * @throws Error if any validation fails
 */
export declare function validateRiskData(riskData: any): void;
/**
 * Comprehensive user data validation
 * @param userData - The user data to validate
 * @throws Error if any validation fails
 */
export declare function validateUserData(userData: any): void;
//# sourceMappingURL=validation.d.ts.map