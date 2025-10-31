/**
 * Evidence Management Functions for Story 3.2.2
 *
 * This module provides comprehensive evidence management capabilities including:
 * - Evidence upload and validation
 * - Status tracking (submitted, reviewed, approved)
 * - Version control
 * - Bulk operations
 * - Search and filtering
 */
/**
 * Create new evidence record
 */
export declare const createEvidence: import("convex/server").RegisteredMutation<"public", {
    description?: string | undefined;
    tags?: string[] | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    projectId: import("convex/values").GenericId<"projects">;
    title: string;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    evidenceType: "document" | "link" | "text" | "file";
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
    content: string;
    submittedBy: import("convex/values").GenericId<"users">;
}, Promise<import("convex/values").GenericId<"evidence">>>;
/**
 * Submit evidence for review
 */
export declare const submitEvidence: import("convex/server").RegisteredMutation<"public", {
    evidenceId: import("convex/values").GenericId<"evidence">;
}, Promise<{
    success: boolean;
}>>;
/**
 * Review evidence and update status
 */
export declare const reviewEvidence: import("convex/server").RegisteredMutation<"public", {
    reviewNotes?: string | undefined;
    status: "approved" | "rejected";
    reviewedBy: import("convex/values").GenericId<"users">;
    evidenceId: import("convex/values").GenericId<"evidence">;
}, Promise<{
    success: boolean;
}>>;
/**
 * Create new version of evidence
 */
export declare const createEvidenceVersion: import("convex/server").RegisteredMutation<"public", {
    description?: string | undefined;
    tags?: string[] | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    title: string;
    content: string;
    submittedBy: import("convex/values").GenericId<"users">;
    evidenceId: import("convex/values").GenericId<"evidence">;
}, Promise<import("convex/values").GenericId<"evidence">>>;
/**
 * Get evidence by ID with full details
 */
export declare const getEvidence: import("convex/server").RegisteredQuery<"public", {
    evidenceId: import("convex/values").GenericId<"evidence">;
}, Promise<{
    project: {
        _id: import("convex/values").GenericId<"projects">;
        _creationTime: number;
        portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
        ownerId?: import("convex/values").GenericId<"users"> | undefined;
        name: string;
        description: string;
        status: "planned" | "active" | "at-risk" | "delayed" | "completed";
        budget: number;
        spentBudget: number;
        timeline: {
            startDate: number;
            endDate: number;
            milestones: {
                name: string;
                status: string;
                date: number;
            }[];
        };
        teamMembers: import("convex/values").GenericId<"users">[];
        healthScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
        tags: string[];
        createdAt: number;
        updatedAt: number;
    } | null;
    criteria: {
        _id: import("convex/values").GenericId<"pmiStandardCriteria">;
        _creationTime: number;
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        standardId: import("convex/values").GenericId<"pmiStandards">;
        requirement: string;
        evidenceType: "document" | "link" | "text" | "file";
        evidenceDescription: string;
        scoringMethod: "binary" | "partial" | "scale";
        maxScore: number;
        isMandatory: boolean;
        order: number;
    } | null;
    standard: {
        _id: import("convex/values").GenericId<"pmiStandards">;
        _creationTime: number;
        name: string;
        description: string;
        createdAt: number;
        updatedAt: number;
        category: "portfolio" | "program" | "project";
        level: "foundational" | "intermediate" | "advanced";
        weight: number;
        version: string;
        isActive: boolean;
    } | null;
    submittedByUser: {
        _id: import("convex/values").GenericId<"users">;
        _creationTime: number;
        name: string;
        createdAt: number;
        updatedAt: number;
        email: string;
        role: "executive" | "portfolio_manager" | "project_officer";
        department: string;
    } | null;
    reviewedByUser: {
        _id: import("convex/values").GenericId<"users">;
        _creationTime: number;
        name: string;
        createdAt: number;
        updatedAt: number;
        email: string;
        role: "executive" | "portfolio_manager" | "project_officer";
        department: string;
    } | null;
    versionHistory: any[];
    _id: import("convex/values").GenericId<"evidence">;
    _creationTime: number;
    description?: string | undefined;
    reviewedAt?: number | undefined;
    submittedAt?: number | undefined;
    fileSize?: number | undefined;
    mimeType?: string | undefined;
    parentEvidenceId?: import("convex/values").GenericId<"evidence"> | undefined;
    reviewedBy?: import("convex/values").GenericId<"users"> | undefined;
    reviewNotes?: string | undefined;
    status: "submitted" | "approved" | "rejected" | "draft" | "under_review" | "archived";
    tags: string[];
    createdAt: number;
    updatedAt: number;
    projectId: import("convex/values").GenericId<"projects">;
    title: string;
    version: number;
    standardId: import("convex/values").GenericId<"pmiStandards">;
    evidenceType: "document" | "link" | "text" | "file";
    criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
    content: string;
    submittedBy: import("convex/values").GenericId<"users">;
    isLatest: boolean;
} | null>>;
/**
 * Search and filter evidence
 */
export declare const searchEvidence: import("convex/server").RegisteredQuery<"public", {
    status?: string[] | undefined;
    startDate?: number | undefined;
    endDate?: number | undefined;
    tags?: string[] | undefined;
    projectId?: import("convex/values").GenericId<"projects"> | undefined;
    standardId?: import("convex/values").GenericId<"pmiStandards"> | undefined;
    evidenceType?: string[] | undefined;
    criteriaId?: import("convex/values").GenericId<"pmiStandardCriteria"> | undefined;
    submittedBy?: import("convex/values").GenericId<"users"> | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}, Promise<{
    evidence: {
        project: {
            _id: import("convex/values").GenericId<"projects">;
            _creationTime: number;
            portfolioId?: import("convex/values").GenericId<"portfolios"> | undefined;
            ownerId?: import("convex/values").GenericId<"users"> | undefined;
            name: string;
            description: string;
            status: "planned" | "active" | "at-risk" | "delayed" | "completed";
            budget: number;
            spentBudget: number;
            timeline: {
                startDate: number;
                endDate: number;
                milestones: {
                    name: string;
                    status: string;
                    date: number;
                }[];
            };
            teamMembers: import("convex/values").GenericId<"users">[];
            healthScore: number;
            riskLevel: "low" | "medium" | "high" | "critical";
            tags: string[];
            createdAt: number;
            updatedAt: number;
        } | null;
        criteria: {
            _id: import("convex/values").GenericId<"pmiStandardCriteria">;
            _creationTime: number;
            name: string;
            description: string;
            createdAt: number;
            updatedAt: number;
            standardId: import("convex/values").GenericId<"pmiStandards">;
            requirement: string;
            evidenceType: "document" | "link" | "text" | "file";
            evidenceDescription: string;
            scoringMethod: "binary" | "partial" | "scale";
            maxScore: number;
            isMandatory: boolean;
            order: number;
        } | null;
        standard: {
            _id: import("convex/values").GenericId<"pmiStandards">;
            _creationTime: number;
            name: string;
            description: string;
            createdAt: number;
            updatedAt: number;
            category: "portfolio" | "program" | "project";
            level: "foundational" | "intermediate" | "advanced";
            weight: number;
            version: string;
            isActive: boolean;
        } | null;
        submittedByUser: {
            _id: import("convex/values").GenericId<"users">;
            _creationTime: number;
            name: string;
            createdAt: number;
            updatedAt: number;
            email: string;
            role: "executive" | "portfolio_manager" | "project_officer";
            department: string;
        } | null;
        _id: import("convex/values").GenericId<"evidence">;
        _creationTime: number;
        description?: string | undefined;
        reviewedAt?: number | undefined;
        submittedAt?: number | undefined;
        fileSize?: number | undefined;
        mimeType?: string | undefined;
        parentEvidenceId?: import("convex/values").GenericId<"evidence"> | undefined;
        reviewedBy?: import("convex/values").GenericId<"users"> | undefined;
        reviewNotes?: string | undefined;
        status: "submitted" | "approved" | "rejected" | "draft" | "under_review" | "archived";
        tags: string[];
        createdAt: number;
        updatedAt: number;
        projectId: import("convex/values").GenericId<"projects">;
        title: string;
        version: number;
        standardId: import("convex/values").GenericId<"pmiStandards">;
        evidenceType: "document" | "link" | "text" | "file";
        criteriaId: import("convex/values").GenericId<"pmiStandardCriteria">;
        content: string;
        submittedBy: import("convex/values").GenericId<"users">;
        isLatest: boolean;
    }[];
    totalCount: number;
    hasMore: boolean;
}>>;
/**
 * Bulk update evidence status
 */
export declare const bulkUpdateEvidenceStatus: import("convex/server").RegisteredMutation<"public", {
    status: "submitted" | "approved" | "rejected" | "draft" | "under_review" | "archived";
    initiatedBy: import("convex/values").GenericId<"users">;
    evidenceIds: import("convex/values").GenericId<"evidence">[];
}, Promise<{
    operationId: string;
    success: boolean;
    totalProcessed: number;
    failed: number;
}>>;
/**
 * Get evidence statistics for a project
 */
export declare const getEvidenceStatistics: import("convex/server").RegisteredQuery<"public", {
    projectId: import("convex/values").GenericId<"projects">;
}, Promise<{
    total: number;
    byStatus: {
        draft: number;
        submitted: number;
        under_review: number;
        approved: number;
        rejected: number;
        archived: number;
    };
    byType: {
        document: number;
        link: number;
        text: number;
        file: number;
    };
    latestSubmission: number;
}>>;
//# sourceMappingURL=evidenceManagement.d.ts.map